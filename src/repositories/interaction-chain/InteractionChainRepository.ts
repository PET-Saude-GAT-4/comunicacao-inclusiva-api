import { Prisma } from "@/generated/prisma/client.js";
import type {
  ChainTrigger,
  InteractionChainOutput,
  InteractionChainRepositoryInput,
  InteractionChainRepositoryUpdateInput,
  TriggerRef,
} from "@/models/types/InteractionChain.type.js";
import { prisma } from "@/prisma.js";
import { isEmpty } from "@/utils/object.js";

import type { IInteractionChainRepository } from "./IInteractionChainRepository.js";

const triggerSelect = {
  select: {
    uuid: true,
    publishedAt: true,
    author: { select: { uuid: true } },
  },
} as const;

const include = {
  triggerBoard: triggerSelect,
  triggerPhrase: triggerSelect,
  responseBoard: { select: { uuid: true } },
} as const;

// Which column holds a given trigger's list. Every rank operation is scoped by
// this, so a board's ranks and a phrase's ranks never interfere.
const listWhere = (trigger: TriggerRef) =>
  trigger.type === "board"
    ? { triggerBoardId: trigger.id }
    : { triggerPhraseId: trigger.id };

// Writing a trigger always clears the other arm, so the CHECK cannot be broken
// by moving a chain from one kind of trigger to the other.
const triggerWrite = (trigger: TriggerRef) =>
  trigger.type === "board"
    ? { triggerBoardId: trigger.id, triggerPhraseId: null }
    : { triggerBoardId: null, triggerPhraseId: trigger.id };

type TriggerRow = {
  uuid: string;
  publishedAt: Date | null;
  author: { uuid: string } | null;
} | null;

class InteractionChainRepository implements IInteractionChainRepository {
  private _map(data: {
    id: number;
    uuid: string;
    triggerBoard: TriggerRow;
    triggerPhrase: TriggerRow;
    responseBoard: { uuid: string };
    rank: number;
    label: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): InteractionChainOutput {
    const trigger = data.triggerBoard ?? data.triggerPhrase;
    if (!trigger) {
      // The CHECK constraint makes this unreachable; it exists so the arc's
      // invariant fails loudly rather than as a downstream undefined.
      throw new Error(`Interaction chain ${data.uuid} has no trigger.`);
    }

    return {
      id: data.id,
      uuid: data.uuid,
      trigger: {
        type: data.triggerBoard ? "board" : "phrase",
        uuid: trigger.uuid,
      },
      triggerAuthorUuid: trigger.author?.uuid ?? null,
      triggerPublishedAt: trigger.publishedAt,
      responseBoardUuid: data.responseBoard.uuid,
      rank: data.rank,
      label: data.label,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private _triggerRefFromRow(row: {
    triggerBoardId: number | null;
    triggerPhraseId: number | null;
  }): TriggerRef {
    if (row.triggerBoardId !== null) {
      return { type: "board", id: row.triggerBoardId };
    }
    if (row.triggerPhraseId !== null) {
      return { type: "phrase", id: row.triggerPhraseId };
    }
    throw new Error("Interaction chain has no trigger.");
  }

  // Ranks are kept contiguous (1..n per trigger), so the size of the list is
  // also the highest rank in it.
  private async _countInList(
    tx: Prisma.TransactionClient,
    trigger: TriggerRef,
  ): Promise<number> {
    return tx.interactionChain.count({ where: listWhere(trigger) });
  }

  private _clamp(rank: number, max: number): number {
    return Math.min(Math.max(rank, 1), max);
  }

  // Opens a slot at `rank` by pushing everything from there on one step down.
  private async _openSlot(
    tx: Prisma.TransactionClient,
    trigger: TriggerRef,
    rank: number,
  ): Promise<void> {
    await tx.interactionChain.updateMany({
      where: { ...listWhere(trigger), rank: { gte: rank } },
      data: { rank: { increment: 1 } },
    });
  }

  // Closes the hole left at `rank` by a removal or a move to another trigger.
  private async _closeSlot(
    tx: Prisma.TransactionClient,
    trigger: TriggerRef,
    rank: number,
  ): Promise<void> {
    await tx.interactionChain.updateMany({
      where: { ...listWhere(trigger), rank: { gt: rank } },
      data: { rank: { decrement: 1 } },
    });
  }

  async create(
    data: InteractionChainRepositoryInput,
  ): Promise<InteractionChainOutput> {
    const result = await prisma.$transaction(async (tx) => {
      const count = await this._countInList(tx, data.trigger);
      // A new edge may land anywhere from the head to one past the end.
      const rank =
        data.rank !== undefined ? this._clamp(data.rank, count + 1) : count + 1;

      if (rank <= count) {
        await this._openSlot(tx, data.trigger, rank);
      }

      return tx.interactionChain.create({
        data: {
          ...triggerWrite(data.trigger),
          responseBoardId: data.responseBoardId,
          rank,
          label: data.label ?? null,
        },
        include,
      });
    });

    return this._map(result);
  }

  async update(
    id: number,
    data: InteractionChainRepositoryUpdateInput,
  ): Promise<InteractionChainOutput> {
    if (isEmpty(data)) {
      throw new Error("No fields to update.");
    }

    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.interactionChain.findUniqueOrThrow({
        where: { id },
        select: {
          triggerBoardId: true,
          triggerPhraseId: true,
          rank: true,
        },
      });

      const currentTrigger = this._triggerRefFromRow(current);
      const targetTrigger = data.trigger ?? currentTrigger;
      // A move counts whether the kind changed or only the row it points at.
      const movedList =
        targetTrigger.type !== currentTrigger.type ||
        targetTrigger.id !== currentTrigger.id;

      let rank: number | typeof Prisma.skip = Prisma.skip;

      if (movedList) {
        // Leaving the old list closes up behind it; the edge then slots into
        // the new list, appended unless a position was asked for.
        await this._closeSlot(tx, currentTrigger, current.rank);

        const count = await this._countInList(tx, targetTrigger);
        rank =
          data.rank !== undefined
            ? this._clamp(data.rank, count + 1)
            : count + 1;

        await this._openSlot(tx, targetTrigger, rank);
      } else if (data.rank !== undefined) {
        const count = await this._countInList(tx, targetTrigger);
        const target = this._clamp(data.rank, count);

        // Reordering in place: only the edges between the old and the new
        // position shift, and they shift toward the vacated slot.
        if (target > current.rank) {
          await tx.interactionChain.updateMany({
            where: {
              ...listWhere(targetTrigger),
              rank: { gt: current.rank, lte: target },
            },
            data: { rank: { decrement: 1 } },
          });
        } else if (target < current.rank) {
          await tx.interactionChain.updateMany({
            where: {
              ...listWhere(targetTrigger),
              rank: { gte: target, lt: current.rank },
            },
            data: { rank: { increment: 1 } },
          });
        }

        rank = target;
      }

      return tx.interactionChain.update({
        where: { id },
        data: {
          ...(data.trigger ? triggerWrite(data.trigger) : {}),
          responseBoardId: data.responseBoardId ?? Prisma.skip,
          rank,
          label: data.label !== undefined ? data.label : Prisma.skip,
        },
        include,
      });
    });

    return this._map(result);
  }

  async findAll(filter?: {
    triggerAuthorUuid?: string;
  }): Promise<InteractionChainOutput[]> {
    const authorUuid = filter?.triggerAuthorUuid;

    const results = await prisma.interactionChain.findMany({
      where:
        authorUuid != null
          ? {
              OR: [
                { triggerBoard: { author: { uuid: authorUuid } } },
                { triggerPhrase: { author: { uuid: authorUuid } } },
              ],
            }
          : Prisma.skip,
      orderBy: [{ rank: "asc" }, { id: "asc" }],
      include,
    });

    return results.map((r) => this._map(r));
  }

  async findById(id: number): Promise<InteractionChainOutput | null> {
    const result = await prisma.interactionChain.findUnique({
      where: { id },
      include,
    });

    return result ? this._map(result) : null;
  }

  async findByUuid(uuid: string): Promise<InteractionChainOutput | null> {
    const result = await prisma.interactionChain.findUnique({
      where: { uuid },
      include,
    });

    return result ? this._map(result) : null;
  }

  async findByTrigger(
    trigger: ChainTrigger,
  ): Promise<InteractionChainOutput[]> {
    const results = await prisma.interactionChain.findMany({
      where:
        trigger.type === "board"
          ? { triggerBoard: { uuid: trigger.uuid } }
          : { triggerPhrase: { uuid: trigger.uuid } },
      orderBy: [{ rank: "asc" }, { id: "asc" }],
      include,
    });

    return results.map((r) => this._map(r));
  }

  async findByTriggerAndResponse(
    trigger: TriggerRef,
    responseBoardId: number,
  ): Promise<InteractionChainOutput | null> {
    const result = await prisma.interactionChain.findFirst({
      where: { ...listWhere(trigger), responseBoardId },
      include,
    });

    return result ? this._map(result) : null;
  }

  async delete(id: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const current = await tx.interactionChain.findUnique({
        where: { id },
        select: {
          triggerBoardId: true,
          triggerPhraseId: true,
          rank: true,
        },
      });

      if (!current) return;

      await tx.interactionChain.delete({ where: { id } });

      await this._closeSlot(tx, this._triggerRefFromRow(current), current.rank);
    });
  }
}

export default InteractionChainRepository;

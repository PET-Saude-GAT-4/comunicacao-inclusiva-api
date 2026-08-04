import { Prisma } from "@/generated/prisma/client.js";
import type {
  InteractionChainOutput,
  InteractionChainRepositoryInput,
  InteractionChainRepositoryUpdateInput,
} from "@/models/types/InteractionChain.type.js";
import { prisma } from "@/prisma.js";
import { isEmpty } from "@/utils/object.js";

import type { IInteractionChainRepository } from "./IInteractionChainRepository.js";

const include = {
  triggerBoard: {
    select: {
      uuid: true,
      publishedAt: true,
      author: { select: { uuid: true } },
    },
  },
  responseBoard: { select: { uuid: true } },
} as const;

class InteractionChainRepository implements IInteractionChainRepository {
  private _map(data: {
    id: number;
    uuid: string;
    triggerBoard: {
      uuid: string;
      publishedAt: Date | null;
      author: { uuid: string } | null;
    };
    responseBoard: { uuid: string };
    rank: number;
    label: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): InteractionChainOutput {
    return {
      id: data.id,
      uuid: data.uuid,
      triggerBoardUuid: data.triggerBoard.uuid,
      triggerBoardAuthorUuid: data.triggerBoard.author?.uuid ?? null,
      triggerBoardPublishedAt: data.triggerBoard.publishedAt,
      responseBoardUuid: data.responseBoard.uuid,
      rank: data.rank,
      label: data.label,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  // Ranks are kept contiguous (1..n per trigger board), so the size of the
  // list is also the highest rank in it.
  private async _countInList(
    tx: Prisma.TransactionClient,
    triggerBoardId: number,
  ): Promise<number> {
    return tx.interactionChain.count({ where: { triggerBoardId } });
  }

  private _clamp(rank: number, max: number): number {
    return Math.min(Math.max(rank, 1), max);
  }

  // Opens a slot at `rank` by pushing everything from there on one step down.
  private async _openSlot(
    tx: Prisma.TransactionClient,
    triggerBoardId: number,
    rank: number,
  ): Promise<void> {
    await tx.interactionChain.updateMany({
      where: { triggerBoardId, rank: { gte: rank } },
      data: { rank: { increment: 1 } },
    });
  }

  // Closes the hole left at `rank` by a removal or a move to another board.
  private async _closeSlot(
    tx: Prisma.TransactionClient,
    triggerBoardId: number,
    rank: number,
  ): Promise<void> {
    await tx.interactionChain.updateMany({
      where: { triggerBoardId, rank: { gt: rank } },
      data: { rank: { decrement: 1 } },
    });
  }

  async create(
    data: InteractionChainRepositoryInput,
  ): Promise<InteractionChainOutput> {
    const result = await prisma.$transaction(async (tx) => {
      const count = await this._countInList(tx, data.triggerBoardId);
      // A new edge may land anywhere from the head to one past the end.
      const rank =
        data.rank !== undefined ? this._clamp(data.rank, count + 1) : count + 1;

      if (rank <= count) {
        await this._openSlot(tx, data.triggerBoardId, rank);
      }

      return tx.interactionChain.create({
        data: {
          triggerBoardId: data.triggerBoardId,
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
        select: { triggerBoardId: true, rank: true },
      });

      const targetBoardId = data.triggerBoardId ?? current.triggerBoardId;
      const movedBoards = targetBoardId !== current.triggerBoardId;

      let rank: number | typeof Prisma.skip = Prisma.skip;

      if (movedBoards) {
        // Leaving the old list closes up behind it; the edge then slots into
        // the new list, appended unless a position was asked for.
        await this._closeSlot(tx, current.triggerBoardId, current.rank);

        const count = await this._countInList(tx, targetBoardId);
        rank =
          data.rank !== undefined
            ? this._clamp(data.rank, count + 1)
            : count + 1;

        await this._openSlot(tx, targetBoardId, rank);
      } else if (data.rank !== undefined) {
        const count = await this._countInList(tx, targetBoardId);
        const target = this._clamp(data.rank, count);

        // Reordering in place: only the edges between the old and the new
        // position shift, and they shift toward the vacated slot.
        if (target > current.rank) {
          await tx.interactionChain.updateMany({
            where: {
              triggerBoardId: targetBoardId,
              rank: { gt: current.rank, lte: target },
            },
            data: { rank: { decrement: 1 } },
          });
        } else if (target < current.rank) {
          await tx.interactionChain.updateMany({
            where: {
              triggerBoardId: targetBoardId,
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
          triggerBoardId: data.triggerBoardId ?? Prisma.skip,
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
    triggerBoardAuthorUuid?: string;
  }): Promise<InteractionChainOutput[]> {
    const results = await prisma.interactionChain.findMany({
      where:
        filter?.triggerBoardAuthorUuid != null
          ? {
              triggerBoard: { author: { uuid: filter.triggerBoardAuthorUuid } },
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

  async findByTriggerBoardUuid(
    uuid: string,
  ): Promise<InteractionChainOutput[]> {
    const results = await prisma.interactionChain.findMany({
      where: { triggerBoard: { uuid } },
      orderBy: [{ rank: "asc" }, { id: "asc" }],
      include,
    });

    return results.map((r) => this._map(r));
  }

  async delete(id: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const current = await tx.interactionChain.findUnique({
        where: { id },
        select: { triggerBoardId: true, rank: true },
      });

      if (!current) return;

      await tx.interactionChain.delete({ where: { id } });

      await this._closeSlot(tx, current.triggerBoardId, current.rank);
    });
  }
}

export default InteractionChainRepository;

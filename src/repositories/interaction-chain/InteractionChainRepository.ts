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
      label: data.label,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async create(
    data: InteractionChainRepositoryInput,
  ): Promise<InteractionChainOutput> {
    const result = await prisma.interactionChain.create({
      data: {
        triggerBoardId: data.triggerBoardId,
        responseBoardId: data.responseBoardId,
        label: data.label ?? null,
      },
      include,
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

    const result = await prisma.interactionChain.update({
      where: { id },
      data: {
        triggerBoardId: data.triggerBoardId ?? Prisma.skip,
        responseBoardId: data.responseBoardId ?? Prisma.skip,
        label: data.label !== undefined ? data.label : Prisma.skip,
      },
      include,
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
      orderBy: { createdAt: "desc" },
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
      orderBy: { createdAt: "desc" },
      include,
    });

    return results.map((r) => this._map(r));
  }

  async delete(id: number): Promise<void> {
    await prisma.interactionChain.deleteMany({ where: { id } });
  }
}

export default InteractionChainRepository;

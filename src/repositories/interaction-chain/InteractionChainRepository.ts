import { Prisma } from "@/generated/prisma/client.js";
import type {
  InteractionChainInput,
  InteractionChainOutput,
  InteractionChainUpdateInput,
} from "@/models/types/InteractionChain.type.js";
import { prisma } from "@/prisma.js";
import { isEmpty } from "@/utils/object.js";

import type { IInteractionChainRepository } from "./IInteractionChainRepository.js";

const include = {
  triggerBoard: { select: { uuid: true } },
  responseBoard: { select: { uuid: true } },
} as const;

export class InteractionChain implements IInteractionChainRepository {
  private _map(data: {
    id: number;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    triggerBoardUuid: string;
    responseBoardUuid: string;
    label?: string | null;
  }) {
    return {
      id: data.id,
      uuid: data.uuid,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      triggerBoardUuid: data.triggerBoardUuid,
      responseBoardUuid: data.responseBoardUuid,
      ...(data.label !== null && data.label !== undefined
        ? { label: data.label }
        : {}),
    };
  }

  async findAll(): Promise<InteractionChainOutput[]> {
    const results = await prisma.interactionchain.findMany({
      include,
    });

    return results.map((r) =>
      this._map({
        id: r.id,
        uuid: r.uuid,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        triggerBoardUuid: r.triggerBoard.uuid,
        responseBoardUuid: r.responseBoard.uuid,
        label: r.label ?? "No Value",
      }),
    );
  }

  async update(
    id: number,
    data: InteractionChainUpdateInput,
  ): Promise<InteractionChainOutput> {
    if (isEmpty(data)) {
      throw new Error("No fields to update.");
    }

    const result = await prisma.interactionchain.update({
      where: { id: id },
      data: {
        triggerBoardUuid: data.triggerBoardUuid ?? Prisma.skip,
        responseBoardUuid: data.responseBoardUuid ?? Prisma.skip,
        label: data.label ?? Prisma.skip,
      },
      include,
    });

    return this._map(result);
  }

  async delete(id: number): Promise<void> {
    await prisma.interactionchain.deleteMany({
      where: { id },
    });
  }

  async findById(id: number): Promise<InteractionChainOutput | null> {
    const data = await prisma.interactionchain.findUnique({
      where: { id },
      include,
    });
    return data
      ? this._map({
          id: data.id,
          uuid: data.uuid,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          triggerBoardUuid: data.triggerBoard.uuid,
          responseBoardUuid: data.responseBoard.uuid,
          label: data.label ?? "No Value",
        })
      : null;
  }

  async create(data: InteractionChainInput): Promise<InteractionChainOutput> {
    if (isEmpty(data)) {
      throw new Error("No fields to create.");
    }

    const result = await prisma.interactionchain.create({
      data: {
        triggerBoardUuid: data.triggerBoardUuid,
        responseBoardUuid: data.responseBoardUuid,
        label: data.label ?? "",
      },
      include: {
        triggerBoard: true,
        responseBoard: true,
      },
    });

    return this._map({
      id: result.id,
      uuid: result.uuid,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      triggerBoardUuid: result.triggerBoard.uuid,
      responseBoardUuid: result.responseBoard.uuid,
      label: result.label ?? "No Value",
    });
  }
}

export default InteractionChain;

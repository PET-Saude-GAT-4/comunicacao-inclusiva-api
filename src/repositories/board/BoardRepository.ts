import { Prisma } from "@/generated/prisma/client.js";
import type {
  BoardOutput,
  BoardRepositoryInput,
} from "@/models/types/Board.type.js";
import type {
  BoardItemOutput,
  BoardItemRepositoryInput,
} from "@/models/types/BoardItem.type.js";
import { prisma } from "@/prisma.js";
import { mapPictogramRow } from "@/repositories/pictogram/PictogramMapper.js";
import { mapTermRow, termInclude } from "@/repositories/term/TermMapper.js";
import { isEmpty } from "@/utils/object.js";

import type { IBoardRepository } from "./IBoardRepository.js";

const include = {
  representative: { include: { storedFile: true } },
  author: { select: { uuid: true } },
  _count: { select: { terms: true } },
} as const;

class BoardRepository implements IBoardRepository {
  private _map(data: {
    id: number;
    uuid: string;
    title: string;
    author: { uuid: string } | null;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    representative: {
      id: number;
      uuid: string;
      description: string;
      storedFile: { uuid: string };
      createdAt: Date;
      updatedAt: Date;
    };
    _count: { terms: number };
  }): BoardOutput {
    return {
      id: data.id,
      uuid: data.uuid,
      title: data.title,
      authorUuid: data.author?.uuid ?? null,
      representativePictogram: mapPictogramRow(data.representative),
      itemCount: data._count.terms,
      publishedAt: data.publishedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async create(data: BoardRepositoryInput): Promise<BoardOutput> {
    const result = await prisma.board.create({
      data: {
        title: data.title,
        authorId: data.authorId ?? null,
        representativeId: data.representativeId,
      },
      include,
    });

    return this._map(result);
  }

  async update(
    id: number,
    data: { title: string | undefined; representativeId: number | undefined },
  ): Promise<BoardOutput> {
    if (isEmpty(data)) {
      throw new Error("No fields to update.");
    }

    const result = await prisma.board.update({
      where: { id },
      data: {
        title: data.title ?? Prisma.skip,
        representativeId: data.representativeId ?? Prisma.skip,
      },
      include,
    });
    return this._map(result);
  }

  async findAll(filter?: { authorUuid?: string }): Promise<BoardOutput[]> {
    const results = await prisma.board.findMany({
      where:
        filter?.authorUuid != null
          ? { author: { uuid: filter.authorUuid } }
          : Prisma.skip,
      orderBy: {
        createdAt: "desc",
      },
      include,
    });
    return results.map((r) => this._map(r));
  }

  async findById(id: number): Promise<BoardOutput | null> {
    const result = await prisma.board.findUnique({
      where: { id },
      include,
    });
    return result ? this._map(result) : null;
  }

  async findByUuid(uuid: string): Promise<BoardOutput | null> {
    const result = await prisma.board.findUnique({
      where: { uuid },
      include,
    });
    return result ? this._map(result) : null;
  }

  async findAllPublished(): Promise<BoardOutput[]> {
    const results = await prisma.board.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      include,
    });
    return results.map((r) => this._map(r));
  }

  async setPublishedAt(id: number, value: Date | null): Promise<BoardOutput> {
    const result = await prisma.board.update({
      where: { id },
      data: { publishedAt: value },
      include,
    });
    return this._map(result);
  }

  async existsById(id: number): Promise<boolean> {
    const count = await prisma.board.count({ where: { id } });
    return count > 0;
  }

  async existsByUuid(uuid: string): Promise<boolean> {
    const count = await prisma.board.count({ where: { uuid } });
    return count > 0;
  }

  async delete(id: number): Promise<void> {
    await prisma.board.deleteMany({ where: { id } });
  }

  async addItem(data: BoardItemRepositoryInput): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const board = await tx.board.findUniqueOrThrow({
        where: { id: data.boardId },
        select: { first: true },
      });

      const isHead = data.next === board.first;

      // With `next` null this finds the tail, which is the predecessor of an append.
      let predecessorId: number | null = null;
      if (!isHead) {
        const predecessor = await tx.boardItem.findFirst({
          where: { boardId: data.boardId, next: data.next },
        });
        predecessorId = predecessor?.id ?? null;
      }

      const created = await tx.boardItem.create({
        data: {
          boardId: data.boardId,
          termId: data.termId,
          next: data.next,
        },
      });

      if (isHead) {
        await tx.board.update({
          where: { id: data.boardId },
          data: { first: created.id },
        });
      } else if (predecessorId !== null) {
        await tx.boardItem.update({
          where: { id: predecessorId },
          data: { next: created.id },
        });
      }
    });
  }

  async deleteBoardItem(boardId: number, boardItemId: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const node = await tx.boardItem.findUniqueOrThrow({
        where: { id: boardItemId },
        select: { next: true },
      });

      const board = await tx.board.findUniqueOrThrow({
        where: { id: boardId },
        select: { first: true },
      });

      if (board.first === boardItemId) {
        await tx.board.update({
          where: { id: boardId },
          data: { first: node.next },
        });
      } else {
        const predecessor = await tx.boardItem.findFirst({
          where: { boardId, next: boardItemId },
        });
        if (predecessor) {
          await tx.boardItem.update({
            where: { id: predecessor.id },
            data: { next: node.next },
          });
        }
      }

      await tx.boardItem.delete({ where: { id: boardItemId } });
    });
  }

  async findItemsByBoardId(boardId: number): Promise<BoardItemOutput[]> {
    const board = await prisma.board.findUniqueOrThrow({
      where: { id: boardId },
      select: {
        first: true,
        terms: { include: { item: { include: termInclude } } },
      },
    });

    const map = new Map(board.terms.map((bi) => [bi.id, bi]));
    const ordered: BoardItemOutput[] = [];
    let currentId = board.first;
    while (currentId !== null) {
      const node = map.get(currentId);
      if (!node) break;
      ordered.push({
        id: node.id,
        uuid: node.uuid,
        term: mapTermRow(node.item),
      });
      currentId = node.next;
    }
    return ordered;
  }

  async findNextBoardsByBoardId(boardId: number): Promise<BoardOutput[]> {
    const results = await prisma.interactionChain.findMany({
      where: {
        triggerBoardId: boardId,
        responseBoard: { publishedAt: { not: null } },
      },
      orderBy: [{ rank: "asc" }, { id: "asc" }],
      select: { responseBoard: { include } },
    });

    return results.map((r) => this._map(r.responseBoard));
  }

  async existsBoardItem(boardId: number, termId: number): Promise<boolean> {
    const count = await prisma.boardItem.count({
      where: { boardId, termId },
    });
    return count > 0;
  }

  async findItemByUuid(
    boardId: number,
    uuid: string,
  ): Promise<{ id: number } | null> {
    return prisma.boardItem.findFirst({
      where: { boardId, uuid },
      select: { id: true },
    });
  }

  async reorderItem(
    boardId: number,
    boardItemId: number,
    next: number | null,
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const node = await tx.boardItem.findUniqueOrThrow({
        where: { id: boardItemId },
        select: { next: true },
      });

      if (node.next === next) return;

      const board = await tx.board.findUniqueOrThrow({
        where: { id: boardId },
        select: { first: true },
      });

      // Detach from current position
      if (board.first === boardItemId) {
        await tx.board.update({
          where: { id: boardId },
          data: { first: node.next },
        });
      } else {
        const currentPredecessor = await tx.boardItem.findFirst({
          where: { boardId, next: boardItemId },
        });
        if (currentPredecessor) {
          await tx.boardItem.update({
            where: { id: currentPredecessor.id },
            data: { next: node.next },
          });
        }
      }

      // Re-fetch board.first after detach (may have changed)
      const updatedBoard = await tx.board.findUniqueOrThrow({
        where: { id: boardId },
        select: { first: true },
      });

      // Reattach at new position
      const isNewHead = next === updatedBoard.first;

      let newPredecessorId: number | null = null;
      if (!isNewHead) {
        const predecessor = await tx.boardItem.findFirst({
          where: { boardId, next, id: { not: boardItemId } },
        });
        newPredecessorId = predecessor?.id ?? null;
      }

      await tx.boardItem.update({
        where: { id: boardItemId },
        data: { next },
      });

      if (isNewHead) {
        await tx.board.update({
          where: { id: boardId },
          data: { first: boardItemId },
        });
      } else if (newPredecessorId !== null) {
        await tx.boardItem.update({
          where: { id: newPredecessorId },
          data: { next: boardItemId },
        });
      }
    });
  }
}

export default BoardRepository;

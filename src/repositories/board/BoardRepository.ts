import { Prisma } from "@/generated/prisma/client.js";
import type {
  BoardOutput,
  BoardRepositoryInput,
} from "@/models/types/Board.type.js";
import type { BoardPictogramRepositoryInput } from "@/models/types/BoardPictogram.type.js";
import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import { prisma } from "@/prisma.js";
import { isEmpty } from "@/utils/object.js";

import type { IBoardRepository } from "./IBoardRepository.js";

const include = {
  representative: { include: { storedFile: true } },
  author: { select: { uuid: true } },
} as const;

class BoardRepository implements IBoardRepository {
  private _mapPictogram(data: {
    pictogram: {
      id: number;
      uuid: string;
      description: string;
      storedFile: { uuid: string };
      createdAt: Date;
      updatedAt: Date;
    };
  }): PictogramOutput {
    return {
      id: data.pictogram.id,
      uuid: data.pictogram.uuid,
      description: data.pictogram.description,
      fileUuid: data.pictogram.storedFile.uuid,
      createdAt: data.pictogram.createdAt,
      updatedAt: data.pictogram.updatedAt,
    };
  }

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
  }): BoardOutput {
    return {
      id: data.id,
      uuid: data.uuid,
      title: data.title,
      authorUuid: data.author?.uuid ?? null,
      representativePictogram: this._mapPictogram({
        pictogram: data.representative,
      }),
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

  async addPictogram(data: BoardPictogramRepositoryInput): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const board = await tx.board.findUniqueOrThrow({
        where: { id: data.boardId },
        select: { first: true },
      });

      const isHead = data.next === board.first;

      let predecessorPictogramId: number | null = null;
      if (!isHead) {
        if (data.next === null) {
          const tail = await tx.boardPictogram.findFirst({
            where: { boardId: data.boardId, next: null },
          });
          predecessorPictogramId = tail?.pictogramId ?? null;
        } else {
          const predecessor = await tx.boardPictogram.findFirst({
            where: { boardId: data.boardId, next: data.next },
          });
          predecessorPictogramId = predecessor?.pictogramId ?? null;
        }
      }

      await tx.boardPictogram.create({
        data: {
          boardId: data.boardId,
          pictogramId: data.pictogramId,
          next: data.next,
        },
      });

      if (isHead) {
        await tx.board.update({
          where: { id: data.boardId },
          data: { first: data.pictogramId },
        });
      } else if (predecessorPictogramId !== null) {
        await tx.boardPictogram.update({
          where: {
            boardId_pictogramId: {
              boardId: data.boardId,
              pictogramId: predecessorPictogramId,
            },
          },
          data: { next: data.pictogramId },
        });
      }
    });
  }

  async deleteBoardPictogram(
    boardId: number,
    pictogramId: number,
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const node = await tx.boardPictogram.findUniqueOrThrow({
        where: { boardId_pictogramId: { boardId, pictogramId } },
        select: { next: true },
      });

      const board = await tx.board.findUniqueOrThrow({
        where: { id: boardId },
        select: { first: true },
      });

      if (board.first === pictogramId) {
        await tx.board.update({
          where: { id: boardId },
          data: { first: node.next },
        });
      } else {
        const predecessor = await tx.boardPictogram.findFirst({
          where: { boardId, next: pictogramId },
        });
        if (predecessor) {
          await tx.boardPictogram.update({
            where: {
              boardId_pictogramId: {
                boardId,
                pictogramId: predecessor.pictogramId,
              },
            },
            data: { next: node.next },
          });
        }
      }

      await tx.boardPictogram.delete({
        where: { boardId_pictogramId: { boardId, pictogramId } },
      });
    });
  }

  async findPictogramsByBoardId(boardId: number): Promise<PictogramOutput[]> {
    const board = await prisma.board.findUniqueOrThrow({
      where: { id: boardId },
      select: {
        first: true,
        pictograms: {
          include: { pictogram: { include: { storedFile: true } } },
        },
      },
    });

    const map = new Map(board.pictograms.map((bp) => [bp.pictogramId, bp]));
    const ordered: PictogramOutput[] = [];
    let currentId = board.first;
    while (currentId !== null) {
      const node = map.get(currentId);
      if (!node) break;
      ordered.push(this._mapPictogram(node));
      currentId = node.next;
    }
    return ordered;
  }

  async existsBoardPictogram(
    boardId: number,
    pictogramId: number,
  ): Promise<boolean> {
    const count = await prisma.boardPictogram.count({
      where: { boardId, pictogramId },
    });
    return count > 0;
  }

  async reorderPictogram(
    boardId: number,
    pictogramId: number,
    next: number | null,
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const node = await tx.boardPictogram.findUniqueOrThrow({
        where: { boardId_pictogramId: { boardId, pictogramId } },
        select: { next: true },
      });

      if (node.next === next) return;

      const board = await tx.board.findUniqueOrThrow({
        where: { id: boardId },
        select: { first: true },
      });

      // Detach from current position
      if (board.first === pictogramId) {
        await tx.board.update({
          where: { id: boardId },
          data: { first: node.next },
        });
      } else {
        const currentPredecessor = await tx.boardPictogram.findFirst({
          where: { boardId, next: pictogramId },
        });
        if (currentPredecessor) {
          await tx.boardPictogram.update({
            where: {
              boardId_pictogramId: {
                boardId,
                pictogramId: currentPredecessor.pictogramId,
              },
            },
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

      let newPredecessorPictogramId: number | null = null;
      if (!isNewHead) {
        if (next === null) {
          const tail = await tx.boardPictogram.findFirst({
            where: { boardId, next: null, pictogramId: { not: pictogramId } },
          });
          newPredecessorPictogramId = tail?.pictogramId ?? null;
        } else {
          const predecessor = await tx.boardPictogram.findFirst({
            where: { boardId, next, pictogramId: { not: pictogramId } },
          });
          newPredecessorPictogramId = predecessor?.pictogramId ?? null;
        }
      }

      await tx.boardPictogram.update({
        where: { boardId_pictogramId: { boardId, pictogramId } },
        data: { next },
      });

      if (isNewHead) {
        await tx.board.update({
          where: { id: boardId },
          data: { first: pictogramId },
        });
      } else if (newPredecessorPictogramId !== null) {
        await tx.boardPictogram.update({
          where: {
            boardId_pictogramId: {
              boardId,
              pictogramId: newPredecessorPictogramId,
            },
          },
          data: { next: pictogramId },
        });
      }
    });
  }
}

export default BoardRepository;

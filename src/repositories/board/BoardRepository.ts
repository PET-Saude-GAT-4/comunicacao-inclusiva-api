import { Prisma } from "@/generated/prisma/client.js";
import type {
  BoardFilter,
  BoardOutput,
  BoardRepositoryInput,
  BoardRepositoryUpdateInput,
} from "@/models/types/Board.type.js";
import type {
  BoardTermOutput,
  BoardTermRepositoryInput,
} from "@/models/types/BoardTerm.type.js";
import { prisma } from "@/prisma.js";
import { boardInclude, mapBoardRow } from "@/repositories/board/BoardMapper.js";
import { mapTermRow, termInclude } from "@/repositories/term/TermMapper.js";
import { isEmpty } from "@/utils/object.js";

import type { IBoardRepository } from "./IBoardRepository.js";

class BoardRepository implements IBoardRepository {
  // Every pointer edit reads Board.first and a predecessor's next, then rewrites
  // them. Locking the board row first serialises those edits per board; without
  // it two concurrent edits read the same predecessor and the last write
  // orphans the other node.
  private async _lockBoard(
    tx: Prisma.TransactionClient,
    boardId: number,
  ): Promise<void> {
    await tx.$queryRaw`SELECT id FROM "Board" WHERE id = ${boardId} FOR UPDATE`;
  }

  async create(data: BoardRepositoryInput): Promise<BoardOutput> {
    const result = await prisma.board.create({
      data: {
        title: data.title,
        // Left to the column default ("common") when the caller names none.
        type: data.type ?? Prisma.skip,
        authorId: data.authorId ?? null,
        representativeId: data.representativeId,
      },
      include: boardInclude,
    });

    return mapBoardRow(result);
  }

  async update(
    id: number,
    data: BoardRepositoryUpdateInput,
  ): Promise<BoardOutput> {
    if (isEmpty(data)) {
      throw new Error("No fields to update.");
    }

    const result = await prisma.board.update({
      where: { id },
      data: {
        title: data.title ?? Prisma.skip,
        type: data.type ?? Prisma.skip,
        representativeId: data.representativeId ?? Prisma.skip,
      },
      include: boardInclude,
    });
    return mapBoardRow(result);
  }

  async findAll(
    filter?: { authorUuid?: string } & BoardFilter,
  ): Promise<BoardOutput[]> {
    const results = await prisma.board.findMany({
      where: {
        author:
          filter?.authorUuid != null
            ? { uuid: filter.authorUuid }
            : Prisma.skip,
        type: filter?.type ?? Prisma.skip,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: boardInclude,
    });
    return results.map((r) => mapBoardRow(r));
  }

  async findById(id: number): Promise<BoardOutput | null> {
    const result = await prisma.board.findUnique({
      where: { id },
      include: boardInclude,
    });
    return result ? mapBoardRow(result) : null;
  }

  async findByUuid(uuid: string): Promise<BoardOutput | null> {
    const result = await prisma.board.findUnique({
      where: { uuid },
      include: boardInclude,
    });
    return result ? mapBoardRow(result) : null;
  }

  async findAllPublished(filter?: BoardFilter): Promise<BoardOutput[]> {
    const results = await prisma.board.findMany({
      where: {
        publishedAt: { not: null },
        type: filter?.type ?? Prisma.skip,
      },
      orderBy: { publishedAt: "desc" },
      include: boardInclude,
    });
    return results.map((r) => mapBoardRow(r));
  }

  async setPublishedAt(id: number, value: Date | null): Promise<BoardOutput> {
    const result = await prisma.board.update({
      where: { id },
      data: { publishedAt: value },
      include: boardInclude,
    });
    return mapBoardRow(result);
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

  async addTerm(data: BoardTermRepositoryInput): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await this._lockBoard(tx, data.boardId);

      const board = await tx.board.findUniqueOrThrow({
        where: { id: data.boardId },
        select: { first: true },
      });

      const isHead = data.next === board.first;

      // With `next` null this finds the tail, which is the predecessor of an append.
      let predecessorId: number | null = null;
      if (!isHead) {
        const predecessor = await tx.boardTerm.findFirst({
          where: { boardId: data.boardId, next: data.next },
        });
        predecessorId = predecessor?.id ?? null;
      }

      const created = await tx.boardTerm.create({
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
        await tx.boardTerm.update({
          where: { id: predecessorId },
          data: { next: created.id },
        });
      }
    });
  }

  async deleteBoardTerm(boardId: number, boardTermId: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await this._lockBoard(tx, boardId);

      const node = await tx.boardTerm.findUniqueOrThrow({
        where: { id: boardTermId },
        select: { next: true },
      });

      const board = await tx.board.findUniqueOrThrow({
        where: { id: boardId },
        select: { first: true },
      });

      if (board.first === boardTermId) {
        await tx.board.update({
          where: { id: boardId },
          data: { first: node.next },
        });
      } else {
        const predecessor = await tx.boardTerm.findFirst({
          where: { boardId, next: boardTermId },
        });
        if (predecessor) {
          await tx.boardTerm.update({
            where: { id: predecessor.id },
            data: { next: node.next },
          });
        }
      }

      await tx.boardTerm.delete({ where: { id: boardTermId } });
    });
  }

  async findTermsByBoardId(boardId: number): Promise<BoardTermOutput[]> {
    const board = await prisma.board.findUniqueOrThrow({
      where: { id: boardId },
      select: {
        first: true,
        terms: { include: { term: { include: termInclude } } },
      },
    });

    const map = new Map(board.terms.map((bi) => [bi.id, bi]));
    const ordered: BoardTermOutput[] = [];
    let currentId = board.first;
    while (currentId !== null) {
      const node = map.get(currentId);
      if (!node) break;
      ordered.push({
        id: node.id,
        uuid: node.uuid,
        term: mapTermRow(node.term),
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
      select: { responseBoard: { include: boardInclude } },
    });

    return results.map((r) => mapBoardRow(r.responseBoard));
  }

  async findNextBoardsByPhraseId(phraseId: number): Promise<BoardOutput[]> {
    const results = await prisma.interactionChain.findMany({
      where: {
        triggerPhraseId: phraseId,
        responseBoard: { publishedAt: { not: null } },
      },
      orderBy: [{ rank: "asc" }, { id: "asc" }],
      select: { responseBoard: { include: boardInclude } },
    });

    return results.map((r) => mapBoardRow(r.responseBoard));
  }

  async existsBoardTerm(boardId: number, termId: number): Promise<boolean> {
    const count = await prisma.boardTerm.count({
      where: { boardId, termId },
    });
    return count > 0;
  }

  async findBoardTermByUuid(
    boardId: number,
    uuid: string,
  ): Promise<{ id: number } | null> {
    return prisma.boardTerm.findFirst({
      where: { boardId, uuid },
      select: { id: true },
    });
  }

  async reorderTerm(
    boardId: number,
    boardTermId: number,
    next: number | null,
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await this._lockBoard(tx, boardId);

      const node = await tx.boardTerm.findUniqueOrThrow({
        where: { id: boardTermId },
        select: { next: true },
      });

      if (node.next === next) return;

      const board = await tx.board.findUniqueOrThrow({
        where: { id: boardId },
        select: { first: true },
      });

      // Detach from current position
      if (board.first === boardTermId) {
        await tx.board.update({
          where: { id: boardId },
          data: { first: node.next },
        });
      } else {
        const currentPredecessor = await tx.boardTerm.findFirst({
          where: { boardId, next: boardTermId },
        });
        if (currentPredecessor) {
          await tx.boardTerm.update({
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
        const predecessor = await tx.boardTerm.findFirst({
          where: { boardId, next, id: { not: boardTermId } },
        });
        newPredecessorId = predecessor?.id ?? null;
      }

      await tx.boardTerm.update({
        where: { id: boardTermId },
        data: { next },
      });

      if (isNewHead) {
        await tx.board.update({
          where: { id: boardId },
          data: { first: boardTermId },
        });
      } else if (newPredecessorId !== null) {
        await tx.boardTerm.update({
          where: { id: newPredecessorId },
          data: { next: boardTermId },
        });
      }
    });
  }
}

export default BoardRepository;

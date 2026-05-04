import type {
  BoardOutput,
  BoardRepositoryInput,
} from "@/models/types/Board.type.js";
import type { BoardPictogramRepositoryInput } from "@/models/types/BoardPictogram.type.js";
import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import { prisma } from "@/prisma.js";

import type { IBoardRepository } from "./IBoardRepository.js";

const includeRepresentative = {
  representative: { include: { storedFile: true } },
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
    authorId: number | null;
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
      representativePictogram: this._mapPictogram({
        pictogram: data.representative,
      }),
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
      include: includeRepresentative,
    });

    return this._map(result);
  }

  async findAll(): Promise<BoardOutput[]> {
    const results = await prisma.board.findMany({
      include: includeRepresentative,
    });
    return results.map((r) => this._map(r));
  }

  async findById(id: number): Promise<BoardOutput | null> {
    const result = await prisma.board.findUnique({
      where: { id },
      include: includeRepresentative,
    });
    return result ? this._map(result) : null;
  }

  async findByUuid(uuid: string): Promise<BoardOutput | null> {
    const result = await prisma.board.findUnique({
      where: { uuid },
      include: includeRepresentative,
    });
    return result ? this._map(result) : null;
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
    await prisma.boardPictogram.create({
      data: {
        boardId: data.boardId,
        pictogramId: data.pictogramId,
        order: data.order,
      },
    });
  }

  async findPictogramsByBoardId(boardId: number): Promise<PictogramOutput[]> {
    const results = await prisma.boardPictogram.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
      include: { pictogram: { include: { storedFile: true } } },
    });
    return results.map((r) => this._mapPictogram(r));
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

  async getMaxPictogramOrder(boardId: number): Promise<number> {
    const result = await prisma.boardPictogram.aggregate({
      where: { boardId },
      _max: { order: true },
    });
    return result._max.order ?? 0;
  }
}

export default BoardRepository;

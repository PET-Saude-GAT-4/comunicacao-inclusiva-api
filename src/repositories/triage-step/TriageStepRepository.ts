import { Prisma } from "@/generated/prisma/client.js";
import type {
  TriageStepFilter,
  TriageStepOutput,
  TriageStepRepositoryInput,
} from "@/models/types/TriageStep.type.js";
import { prisma } from "@/prisma.js";
import type { BoardRow } from "@/repositories/board/BoardMapper.js";
import { boardInclude, mapBoardRow } from "@/repositories/board/BoardMapper.js";
import { matchingIds, type SearchSource } from "@/repositories/search.js";
import { type ListQuery, type Page, pageArgs } from "@/utils/pagination.js";

import type { ITriageStepRepository } from "./ITriageStepRepository.js";

const include = {
  board: { include: boardInclude },
} as const;

const search: SearchSource = {
  from: Prisma.sql`"TriageStep" ts JOIN "Board" b ON b."id" = ts."boardId"`,
  id: Prisma.sql`ts."id"`,
  columns: [Prisma.sql`b."title"`],
};

class TriageStepRepository implements ITriageStepRepository {
  private _map(data: {
    id: number;
    uuid: string;
    level: number;
    board: BoardRow;
    createdAt: Date;
    updatedAt: Date;
  }): TriageStepOutput {
    return {
      id: data.id,
      uuid: data.uuid,
      level: data.level,
      board: mapBoardRow(data.board),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async create(data: TriageStepRepositoryInput): Promise<TriageStepOutput> {
    const result = await prisma.triageStep.create({
      data: { boardId: data.boardId, level: data.level },
      include,
    });

    return this._map(result);
  }

  // Moves a step to `level`, swapping with the step already there, if any. The
  // two rows hold each other's level for an instant, so the unique constraint
  // on level is deferred to the commit, when both have moved.
  async moveToLevel(
    id: number,
    level: number,
  ): Promise<TriageStepOutput | null> {
    const result = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SET CONSTRAINTS "TriageStep_level_key" DEFERRED`;

      const current = await tx.triageStep.findUnique({
        where: { id },
        select: { level: true },
      });

      // Deleted since the caller looked it up.
      if (!current) return null;

      if (current.level !== level) {
        await tx.triageStep.updateMany({
          where: { level },
          data: { level: current.level },
        });
      }

      return tx.triageStep.update({
        where: { id },
        data: { level },
        include,
      });
    });

    return result ? this._map(result) : null;
  }

  async findAll(filter?: TriageStepFilter): Promise<TriageStepOutput[]> {
    const results = await prisma.triageStep.findMany({
      where: filter?.publishedOnly
        ? { board: { publishedAt: { not: null } } }
        : Prisma.skip,
      orderBy: { level: "asc" },
      include,
    });

    return results.map((r) => this._map(r));
  }

  async findPage(query: ListQuery): Promise<Page<TriageStepOutput>> {
    const where = { id: await matchingIds(query.q, search) };

    const [total, results] = await prisma.$transaction([
      prisma.triageStep.count({ where }),
      prisma.triageStep.findMany({
        where,
        orderBy: { level: "asc" },
        ...pageArgs(query),
        include,
      }),
    ]);

    return { items: results.map((r) => this._map(r)), total };
  }

  async findById(id: number): Promise<TriageStepOutput | null> {
    const result = await prisma.triageStep.findUnique({
      where: { id },
      include,
    });

    return result ? this._map(result) : null;
  }

  async findByUuid(uuid: string): Promise<TriageStepOutput | null> {
    const result = await prisma.triageStep.findUnique({
      where: { uuid },
      include,
    });

    return result ? this._map(result) : null;
  }

  async existsByBoardId(boardId: number): Promise<boolean> {
    const count = await prisma.triageStep.count({ where: { boardId } });
    return count > 0;
  }

  async existsByLevel(level: number): Promise<boolean> {
    const count = await prisma.triageStep.count({ where: { level } });
    return count > 0;
  }

  // Removing a step leaves its level empty; no other step moves.
  async delete(id: number): Promise<void> {
    await prisma.triageStep.deleteMany({ where: { id } });
  }
}

export default TriageStepRepository;

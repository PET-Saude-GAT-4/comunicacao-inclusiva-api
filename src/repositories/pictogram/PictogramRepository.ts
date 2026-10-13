import { Prisma } from "@/generated/prisma/client.js";
import type {
  PictogramOutput,
  PictogramRepositoryInput,
} from "@/models/types/Pictogram.type.js";
import { prisma } from "@/prisma.js";
import { mapPictogramRow } from "@/repositories/pictogram/PictogramMapper.js";
import { matchingIds, type SearchSource } from "@/repositories/search.js";
import { type ListQuery, type Page, pageArgs } from "@/utils/pagination.js";

import type { IPictogramRepository } from "./IPictogramRepository.js";

const search: SearchSource = {
  from: Prisma.sql`"Pictogram"`,
  id: Prisma.sql`"Pictogram"."id"`,
  columns: [Prisma.sql`"Pictogram"."description"`],
};

class PictogramRepository implements IPictogramRepository {
  async create(data: PictogramRepositoryInput): Promise<PictogramOutput> {
    const result = await prisma.pictogram.create({
      data: {
        description: data.description,
        storedFileId: data.storedFileId,
      },
      include: { storedFile: true },
    });

    return mapPictogramRow(result);
  }

  async findAll(): Promise<PictogramOutput[]> {
    const results = await prisma.pictogram.findMany({
      include: { storedFile: true },
    });

    return results.map((r) => mapPictogramRow(r));
  }

  async findPage(query: ListQuery): Promise<Page<PictogramOutput>> {
    const where = { id: await matchingIds(query.q, search) };

    const [total, results] = await prisma.$transaction([
      prisma.pictogram.count({ where }),
      prisma.pictogram.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        ...pageArgs(query),
        include: { storedFile: true },
      }),
    ]);

    return { items: results.map((r) => mapPictogramRow(r)), total };
  }

  async findById(id: number): Promise<PictogramOutput | null> {
    const result = await prisma.pictogram.findUnique({
      where: { id },
      include: { storedFile: true },
    });

    return result ? mapPictogramRow(result) : null;
  }

  async findByUuid(uuid: string): Promise<PictogramOutput | null> {
    const result = await prisma.pictogram.findUnique({
      where: { uuid },
      include: { storedFile: true },
    });

    return result ? mapPictogramRow(result) : null;
  }

  async findManyByUuids(uuids: string[]): Promise<PictogramOutput[]> {
    const results = await prisma.pictogram.findMany({
      where: { uuid: { in: uuids } },
      include: { storedFile: true },
    });

    return results.map((r) => mapPictogramRow(r));
  }

  async existsById(id: number): Promise<boolean> {
    const count = await prisma.pictogram.count({ where: { id } });
    return count > 0;
  }

  async delete(id: number): Promise<void> {
    await prisma.pictogram.deleteMany({ where: { id } });
  }

  async deleteByUuid(uuid: string): Promise<void> {
    await prisma.pictogram.deleteMany({ where: { uuid } });
  }
}

export default PictogramRepository;

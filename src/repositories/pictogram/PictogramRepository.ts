import { Prisma } from "@/generated/prisma/client.js";
import type {
  PictogramListOutput,
  PictogramOutput,
  PictogramRepositoryInput,
} from "@/models/types/Pictogram.type.js";
import { prisma } from "@/prisma.js";
import {
  mapPictogramListRow,
  mapPictogramRow,
  pictogramListInclude,
} from "@/repositories/pictogram/PictogramMapper.js";
import {
  findInOrder,
  type ListSource,
  pageIds,
} from "@/repositories/search.js";
import type { ListQuery, Page } from "@/utils/pagination.js";

import type { IPictogramRepository } from "./IPictogramRepository.js";

const source: ListSource = {
  from: Prisma.sql`"Pictogram"`,
  id: Prisma.sql`"Pictogram"."id"`,
  columns: [Prisma.sql`"Pictogram"."description"`],
  orderBy: Prisma.sql`"Pictogram"."createdAt" DESC, "Pictogram"."id" DESC`,
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

  async findPage(query: ListQuery): Promise<Page<PictogramListOutput>> {
    const { ids, total } = await pageIds(query, source);
    const results = await findInOrder(ids, (rowIds) =>
      prisma.pictogram.findMany({
        where: { id: { in: rowIds } },
        include: pictogramListInclude,
      }),
    );

    return { items: results.map((r) => mapPictogramListRow(r)), total };
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

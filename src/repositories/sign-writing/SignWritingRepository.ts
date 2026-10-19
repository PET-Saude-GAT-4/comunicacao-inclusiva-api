import { Prisma } from "@/generated/prisma/client.js";
import type {
  SignWritingListOutput,
  SignWritingOutput,
  SignWritingRepositoryInput,
} from "@/models/types/SignWriting.type.js";
import { prisma } from "@/prisma.js";
import {
  findInOrder,
  type ListSource,
  pageIds,
} from "@/repositories/search.js";
import {
  mapSignWritingListRow,
  mapSignWritingRow,
  signWritingListInclude,
} from "@/repositories/sign-writing/SignWritingMapper.js";
import type { ListQuery, Page } from "@/utils/pagination.js";

import type { ISignWritingRepository } from "./ISignWritingRepository.js";

const source: ListSource = {
  from: Prisma.sql`"SignWriting"`,
  id: Prisma.sql`"SignWriting"."id"`,
  columns: [Prisma.sql`"SignWriting"."description"`],
  orderBy: Prisma.sql`"SignWriting"."createdAt" DESC, "SignWriting"."id" DESC`,
};

class SignWritingRepository implements ISignWritingRepository {
  async create(data: SignWritingRepositoryInput): Promise<SignWritingOutput> {
    const result = await prisma.signWriting.create({
      data: {
        description: data.description,
        storedFileId: data.storedFileId,
      },
      include: { storedFile: true },
    });

    return mapSignWritingRow(result);
  }

  async findAll(): Promise<SignWritingOutput[]> {
    const results = await prisma.signWriting.findMany({
      include: { storedFile: true },
    });

    return results.map((r) => mapSignWritingRow(r));
  }

  async findPage(query: ListQuery): Promise<Page<SignWritingListOutput>> {
    const { ids, total } = await pageIds(query, source);
    const results = await findInOrder(ids, (chunk) =>
      prisma.signWriting.findMany({
        where: { id: { in: chunk } },
        include: signWritingListInclude,
      }),
    );

    return { items: results.map((r) => mapSignWritingListRow(r)), total };
  }

  async findById(id: number): Promise<SignWritingOutput | null> {
    const result = await prisma.signWriting.findUnique({
      where: { id },
      include: { storedFile: true },
    });

    return result ? mapSignWritingRow(result) : null;
  }

  async findByUuid(uuid: string): Promise<SignWritingOutput | null> {
    const result = await prisma.signWriting.findUnique({
      where: { uuid },
      include: { storedFile: true },
    });

    return result ? mapSignWritingRow(result) : null;
  }

  async findManyByUuids(uuids: string[]): Promise<SignWritingOutput[]> {
    const results = await prisma.signWriting.findMany({
      where: { uuid: { in: uuids } },
      include: { storedFile: true },
    });

    return results.map((r) => mapSignWritingRow(r));
  }

  async existsById(id: number): Promise<boolean> {
    const count = await prisma.signWriting.count({ where: { id } });
    return count > 0;
  }

  async delete(id: number): Promise<void> {
    await prisma.signWriting.deleteMany({ where: { id } });
  }

  async deleteByUuid(uuid: string): Promise<void> {
    await prisma.signWriting.deleteMany({ where: { uuid } });
  }
}

export default SignWritingRepository;

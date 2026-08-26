import { Prisma } from "@/generated/prisma/client.js";
import type {
  PhraseOutput,
  PhraseRepositoryInput,
  PhraseRepositoryUpdateInput,
} from "@/models/types/Phrase.type.js";
import { prisma } from "@/prisma.js";
import { mapPictogramRow } from "@/repositories/pictogram/PictogramMapper.js";
import { isEmpty } from "@/utils/object.js";

import type { IPhraseRepository } from "./IPhraseRepository.js";

const include = {
  author: { select: { uuid: true } },
  pictograms: {
    orderBy: { order: "asc" },
    include: { pictogram: { include: { storedFile: true } } },
  },
} as const;

class PhraseRepository implements IPhraseRepository {
  private _map(data: {
    id: number;
    uuid: string;
    description: string;
    author: { uuid: string } | null;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    pictograms: {
      pictogram: {
        id: number;
        uuid: string;
        description: string;
        storedFile: { uuid: string };
        createdAt: Date;
        updatedAt: Date;
      };
    }[];
  }): PhraseOutput {
    return {
      id: data.id,
      uuid: data.uuid,
      description: data.description,
      authorUuid: data.author?.uuid ?? null,
      pictograms: data.pictograms.map((p) => mapPictogramRow(p.pictogram)),
      publishedAt: data.publishedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async create(data: PhraseRepositoryInput): Promise<PhraseOutput> {
    const result = await prisma.phrase.create({
      data: {
        description: data.description,
        authorId: data.authorId,
        pictograms: {
          create: data.pictogramIds.map((pictogramId, index) => ({
            pictogramId,
            order: index + 1,
          })),
        },
      },
      include,
    });

    return this._map(result);
  }

  async update(
    id: number,
    data: PhraseRepositoryUpdateInput,
  ): Promise<PhraseOutput> {
    if (isEmpty(data)) {
      throw new Error("No fields to update.");
    }

    const result = await prisma.$transaction(async (tx) => {
      const pictogramIds = data.pictogramIds;

      if (pictogramIds !== undefined) {
        await tx.phrasePictogram.deleteMany({ where: { phraseId: id } });

        await tx.phrasePictogram.createMany({
          data: pictogramIds.map((pictogramId, index) => ({
            phraseId: id,
            pictogramId,
            order: index + 1,
          })),
        });
      }

      return tx.phrase.update({
        where: { id },
        data: { description: data.description ?? Prisma.skip },
        include,
      });
    });

    return this._map(result);
  }

  async findAll(filter?: { authorUuid?: string }): Promise<PhraseOutput[]> {
    const results = await prisma.phrase.findMany({
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

  async findById(id: number): Promise<PhraseOutput | null> {
    const result = await prisma.phrase.findUnique({
      where: { id },
      include,
    });

    return result ? this._map(result) : null;
  }

  async findByUuid(uuid: string): Promise<PhraseOutput | null> {
    const result = await prisma.phrase.findUnique({
      where: { uuid },
      include,
    });

    return result ? this._map(result) : null;
  }

  async findAllPublished(): Promise<PhraseOutput[]> {
    const results = await prisma.phrase.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      include,
    });

    return results.map((r) => this._map(r));
  }

  async setPublishedAt(id: number, value: Date | null): Promise<PhraseOutput> {
    const result = await prisma.phrase.update({
      where: { id },
      data: { publishedAt: value },
      include,
    });

    return this._map(result);
  }

  async existsById(id: number): Promise<boolean> {
    const count = await prisma.phrase.count({ where: { id } });
    return count > 0;
  }

  async existsByUuid(uuid: string): Promise<boolean> {
    const count = await prisma.phrase.count({ where: { uuid } });
    return count > 0;
  }

  async delete(id: number): Promise<void> {
    await prisma.phrase.deleteMany({ where: { id } });
  }
}

export default PhraseRepository;

import { Prisma } from "@/generated/prisma/client.js";
import type {
  PhraseOutput,
  PhraseRepositoryInput,
  PhraseRepositoryUpdateInput,
} from "@/models/types/Phrase.type.js";
import { prisma } from "@/prisma.js";
import type { TermRow } from "@/repositories/term/TermMapper.js";
import { mapTermRow, termInclude } from "@/repositories/term/TermMapper.js";
import { isEmpty } from "@/utils/object.js";

import type { IPhraseRepository } from "./IPhraseRepository.js";

const include = {
  author: { select: { uuid: true } },
  terms: {
    orderBy: { order: "asc" },
    include: { term: { include: termInclude } },
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
    terms: { id: number; uuid: string; term: TermRow }[];
  }): PhraseOutput {
    return {
      id: data.id,
      uuid: data.uuid,
      description: data.description,
      authorUuid: data.author?.uuid ?? null,
      terms: data.terms.map((t) => ({
        id: t.id,
        uuid: t.uuid,
        term: mapTermRow(t.term),
      })),
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
        terms: {
          create: data.termIds.map((termId, index) => ({
            termId,
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
      const termIds = data.termIds;

      if (termIds !== undefined) {
        await tx.phraseTerm.deleteMany({ where: { phraseId: id } });

        await tx.phraseTerm.createMany({
          data: termIds.map((termId, index) => ({
            phraseId: id,
            termId,
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

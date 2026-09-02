import type {
  TermOutput,
  TermRepositoryInput,
} from "@/models/types/Term.type.js";
import { prisma } from "@/prisma.js";
import {
  mapTermRow,
  termInclude as include,
} from "@/repositories/term/TermMapper.js";

import type { ITermRepository } from "./ITermRepository.js";

class TermRepository implements ITermRepository {
  async create(data: TermRepositoryInput): Promise<TermOutput> {
    const result = await prisma.term.create({
      data: {
        description: data.description,
        pictogramId: data.pictogramId,
        signWritingId: data.signWritingId,
      },
      include,
    });

    return mapTermRow(result);
  }

  async findAll(): Promise<TermOutput[]> {
    const results = await prisma.term.findMany({ include });

    return results.map((r) => mapTermRow(r));
  }

  async findById(id: number): Promise<TermOutput | null> {
    const result = await prisma.term.findUnique({
      where: { id },
      include,
    });

    return result ? mapTermRow(result) : null;
  }

  async findByUuid(uuid: string): Promise<TermOutput | null> {
    const result = await prisma.term.findUnique({
      where: { uuid },
      include,
    });

    return result ? mapTermRow(result) : null;
  }

  async findManyByUuids(uuids: string[]): Promise<TermOutput[]> {
    const results = await prisma.term.findMany({
      where: { uuid: { in: uuids } },
      include,
    });

    return results.map((r) => mapTermRow(r));
  }

  async existsPair(
    pictogramId: number,
    signWritingId: number,
  ): Promise<boolean> {
    const count = await prisma.term.count({
      where: { pictogramId, signWritingId },
    });
    return count > 0;
  }

  async isInUse(termId: number): Promise<boolean> {
    const [onBoards, inPhrases] = await Promise.all([
      prisma.boardTerm.count({ where: { termId } }),
      prisma.phraseTerm.count({ where: { termId } }),
    ]);
    return onBoards > 0 || inPhrases > 0;
  }

  async delete(id: number): Promise<void> {
    await prisma.term.deleteMany({ where: { id } });
  }

  async deleteByUuid(uuid: string): Promise<void> {
    await prisma.term.deleteMany({ where: { uuid } });
  }
}

export default TermRepository;

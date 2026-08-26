import type {
  TermOutput,
  TermRepositoryInput,
} from "@/models/types/Term.type.js";
import { prisma } from "@/prisma.js";
import type { PictogramRow } from "@/repositories/pictogram/PictogramMapper.js";
import { mapPictogramRow } from "@/repositories/pictogram/PictogramMapper.js";
import type { SignWritingRow } from "@/repositories/sign-writing/SignWritingMapper.js";
import { mapSignWritingRow } from "@/repositories/sign-writing/SignWritingMapper.js";

import type { ITermRepository } from "./ITermRepository.js";

const include = {
  pictogram: { include: { storedFile: true } },
  signWriting: { include: { storedFile: true } },
} as const;

class TermRepository implements ITermRepository {
  private _map(data: {
    id: number;
    uuid: string;
    description: string;
    pictogram: PictogramRow;
    signWriting: SignWritingRow;
    createdAt: Date;
    updatedAt: Date;
  }): TermOutput {
    return {
      id: data.id,
      uuid: data.uuid,
      description: data.description,
      pictogram: mapPictogramRow(data.pictogram),
      signWriting: mapSignWritingRow(data.signWriting),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async create(data: TermRepositoryInput): Promise<TermOutput> {
    const result = await prisma.term.create({
      data: {
        description: data.description,
        pictogramId: data.pictogramId,
        signWritingId: data.signWritingId,
      },
      include,
    });

    return this._map(result);
  }

  async findAll(): Promise<TermOutput[]> {
    const results = await prisma.term.findMany({ include });

    return results.map((r) => this._map(r));
  }

  async findById(id: number): Promise<TermOutput | null> {
    const result = await prisma.term.findUnique({
      where: { id },
      include,
    });

    return result ? this._map(result) : null;
  }

  async findByUuid(uuid: string): Promise<TermOutput | null> {
    const result = await prisma.term.findUnique({
      where: { uuid },
      include,
    });

    return result ? this._map(result) : null;
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

  async delete(id: number): Promise<void> {
    await prisma.term.deleteMany({ where: { id } });
  }

  async deleteByUuid(uuid: string): Promise<void> {
    await prisma.term.deleteMany({ where: { uuid } });
  }
}

export default TermRepository;

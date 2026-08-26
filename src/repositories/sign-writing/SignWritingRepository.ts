import type {
  SignWritingOutput,
  SignWritingRepositoryInput,
} from "@/models/types/SignWriting.type.js";
import { prisma } from "@/prisma.js";

import type { ISignWritingRepository } from "./ISignWritingRepository.js";

class SignWritingRepository implements ISignWritingRepository {
  private _map(data: {
    id: number;
    uuid: string;
    description: string;
    storedFileId: number;
    storedFile: { uuid: string };
    createdAt: Date;
    updatedAt: Date;
  }): SignWritingOutput {
    return {
      id: data.id,
      uuid: data.uuid,
      description: data.description,
      fileUuid: data.storedFile.uuid,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async create(data: SignWritingRepositoryInput): Promise<SignWritingOutput> {
    const result = await prisma.signWriting.create({
      data: {
        description: data.description,
        storedFileId: data.storedFileId,
      },
      include: { storedFile: true },
    });

    return this._map(result);
  }

  async findAll(): Promise<SignWritingOutput[]> {
    const results = await prisma.signWriting.findMany({
      include: { storedFile: true },
    });

    return results.map((r) => this._map(r));
  }

  async findById(id: number): Promise<SignWritingOutput | null> {
    const result = await prisma.signWriting.findUnique({
      where: { id },
      include: { storedFile: true },
    });

    return result ? this._map(result) : null;
  }

  async findByUuid(uuid: string): Promise<SignWritingOutput | null> {
    const result = await prisma.signWriting.findUnique({
      where: { uuid },
      include: { storedFile: true },
    });

    return result ? this._map(result) : null;
  }

  async findManyByUuids(uuids: string[]): Promise<SignWritingOutput[]> {
    const results = await prisma.signWriting.findMany({
      where: { uuid: { in: uuids } },
      include: { storedFile: true },
    });

    return results.map((r) => this._map(r));
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

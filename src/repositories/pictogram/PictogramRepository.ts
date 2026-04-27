import type {
  PictogramOutput,
  PictogramRepositoryInput,
} from "@/models/types/Pictogram.type.js";
import { prisma } from "@/prisma.js";

import type { IPictogramRepository } from "./IPictogramRepository.js";

class PictogramRepository implements IPictogramRepository {
  private _map(data: {
    id: number;
    uuid: string;
    description: string;
    storedFileId: number;
    storedFile: { uuid: string };
    createdAt: Date;
    updatedAt: Date;
  }): PictogramOutput {
    return {
      id: data.id,
      uuid: data.uuid,
      description: data.description,
      fileUuid: data.storedFile.uuid,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async create(data: PictogramRepositoryInput): Promise<PictogramOutput> {
    const result = await prisma.pictogram.create({
      data: {
        description: data.description,
        storedFileId: data.storedFileId,
      },
      include: { storedFile: true },
    });

    return this._map(result);
  }

  async findAll(): Promise<PictogramOutput[]> {
    const results = await prisma.pictogram.findMany({
      include: { storedFile: true },
    });

    return results.map((r) => this._map(r));
  }

  async findById(id: number): Promise<PictogramOutput | null> {
    const result = await prisma.pictogram.findUnique({
      where: { id },
      include: { storedFile: true },
    });

    return result ? this._map(result) : null;
  }

  async findByUuid(uuid: string): Promise<PictogramOutput | null> {
    const result = await prisma.pictogram.findUnique({
      where: { uuid },
      include: { storedFile: true },
    });

    return result ? this._map(result) : null;
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

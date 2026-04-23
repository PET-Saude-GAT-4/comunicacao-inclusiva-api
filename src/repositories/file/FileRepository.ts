import { randomUUID } from "crypto";

import { File } from "@/models/File.js";
import type { StoredFileCreateData } from "@/models/types/StoredFile.type.js";
import type { FileType } from "@/models/types/StoredFile.type.js";
import { prisma } from "@/prisma.js";

import type { IFileRepository } from "./IFileRepository.js";

class FileRepository implements IFileRepository {
  private _map(row: {
    id: number;
    uuid: string;
    location: string;
    filename: string;
    originalName: string;
    fileSize: bigint | null;
    mimeType: string;
    fileType: string;
    purpose: string | null;
    isPrivate: boolean;
    userId: number | null;
    createdAt: Date;
    updatedAt: Date;
  }): File {
    return new File(
      row.id,
      row.uuid,
      row.createdAt,
      row.updatedAt,
      row.location,
      row.filename,
      row.originalName,
      row.fileSize,
      row.mimeType,
      row.fileType as FileType,
      row.purpose,
      row.isPrivate,
      row.userId,
    );
  }

  public async create(data: StoredFileCreateData): Promise<File> {
    const uuid = data.uuid ?? randomUUID();

    const row = await prisma.storedFile.create({
      data: {
        uuid,
        location: data.location,
        filename: data.filename,
        originalName: data.originalName,
        fileSize: data.fileSize !== undefined ? BigInt(data.fileSize) : null,
        mimeType: data.mimeType,
        fileType: data.fileType,
        purpose: data.purpose ?? null,
        isPrivate: data.isPrivate ?? true,
        userId: data.userId ?? null,
      },
    });

    return this._map(row);
  }

  public async find(uuid: string): Promise<File | null> {
    const row = await prisma.storedFile.findUnique({ where: { uuid } });
    return row ? this._map(row) : null;
  }

  public async delete(uuid: string): Promise<void> {
    await prisma.storedFile.deleteMany({ where: { uuid } });
  }
}

export default FileRepository;

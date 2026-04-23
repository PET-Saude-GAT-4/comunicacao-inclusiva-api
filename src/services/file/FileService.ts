import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import z from "zod";

import { env } from "@/config/env.js";
import type { File } from "@/models/File.js";
import type {
  FileObject,
  FileSaveResult,
  FileStoreResult,
  StoredFileInput,
} from "@/models/types/StoredFile.type.js";
import FileRepository from "@/repositories/file/FileRepository.js";
import type { IFileRepository } from "@/repositories/file/IFileRepository.js";
import { mimeToFileType } from "@/utils/file.js";

import type { IFileService } from "./IFileService.js";

type Props = {
  fileRepository?: IFileRepository;
};

class FileService implements IFileService {
  private _fileRepository: IFileRepository;

  constructor(props?: Props) {
    this._fileRepository = props?.fileRepository ?? new FileRepository();
  }

  private async _saveToFileSystem(
    filePath: string,
    filename: string,
    fileBuffer: Buffer,
  ): Promise<void> {
    const baseDir = path.resolve(env.fileStorageDir);
    const fullPath = path.join(baseDir, filePath);
    const fullLocation = path.join(fullPath, filename);

    if (!fullPath.startsWith(baseDir) || !fullLocation.startsWith(fullPath)) {
      throw new Error("Invalid file path.");
    }

    await fs.mkdir(fullPath, { recursive: true });
    await fs.writeFile(fullLocation, fileBuffer);
  }

  private async _deleteFromFileSystem(location: string): Promise<void> {
    const baseDir = path.resolve(env.fileStorageDir);
    const fullLocation = path.join(baseDir, location);

    if (!fullLocation.startsWith(baseDir)) {
      throw new Error("Invalid file path.");
    }

    try {
      await fs.unlink(fullLocation);
    } catch (err) {
      if (err instanceof Error && "code" in err && err.code === "ENOENT") {
        return;
      }
      throw err;
    }

    let currentDir = path.dirname(fullLocation);

    while (currentDir.startsWith(baseDir)) {
      if (currentDir === baseDir) break;

      try {
        const files = await fs.readdir(currentDir);
        if (files.length > 0) break;
        await fs.rmdir(currentDir);
        currentDir = path.dirname(currentDir);
      } catch {
        break;
      }
    }
  }

  public async save(
    file: FileObject,
    fileUuid?: string,
  ): Promise<FileSaveResult> {
    let uuid;
    if (fileUuid) uuid = z.uuid().parse(fileUuid);
    else uuid = randomUUID();

    const parsedFilename = path.parse(file.filename);
    const filename = `${uuid}${parsedFilename.ext}`;
    const filePath = `${uuid.slice(0, 2)}/${uuid.slice(2, 4)}/`;

    await this._saveToFileSystem(filePath, filename, file.buffer);

    const location = path.join(filePath, filename);

    return { uuid, filename, location };
  }

  public async store(file: StoredFileInput): Promise<FileStoreResult> {
    const { uuid, filename, location } = await this.save({
      filename: file.filename,
      originalName: file.originalName,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      buffer: file.buffer,
    });

    try {
      const created = await this._fileRepository.create({
        uuid: uuid,
        filename: filename,
        originalName: file.originalName,
        fileSize: file.fileSize,
        fileType: mimeToFileType(file.mimeType),
        location: location,
        mimeType: file.mimeType,
        isPrivate: file.isPrivate,
        purpose: file.purpose,
        userId: file.userId,
      });

      return {
        id: created.id,
        uuid: uuid,
        filename: filename,
        location: location,
      };
    } catch (err) {
      await this._deleteFromFileSystem(location);
      throw err;
    }
  }

  public find(fileUuid: string): Promise<File | null> {
    return this._fileRepository.find(fileUuid);
  }

  public async delete(fileUuid: string): Promise<void> {
    const file = await this.find(fileUuid);

    if (file === null) return;

    await this._fileRepository.delete(fileUuid);
    await this._deleteFromFileSystem(file.location);
  }
}

export default FileService;

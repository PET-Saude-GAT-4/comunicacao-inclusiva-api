import { NotFoundError } from "@/errors/NotFoundError.js";
import type {
  PictogramInput,
  PictogramOutput,
} from "@/models/types/Pictogram.type.js";
import type { IPictogramRepository } from "@/repositories/pictogram/IPictogramRepository.js";
import PictogramRepository from "@/repositories/pictogram/PictogramRepository.js";
import FileService from "@/services/file/FileService.js";
import type { IFileService } from "@/services/file/IFileService.js";

import type { IPictogramService } from "./IPictogramService.js";

type Props = {
  pictogramRepository?: IPictogramRepository;
  fileService?: IFileService;
};

class PictogramService implements IPictogramService {
  private _pictogramRepository: IPictogramRepository;
  private _fileService: IFileService;

  constructor(props?: Props) {
    this._pictogramRepository =
      props?.pictogramRepository ?? new PictogramRepository();
    this._fileService = props?.fileService ?? new FileService();
  }

  async create(data: PictogramInput): Promise<PictogramOutput> {
    const stored = await this._fileService.store({
      buffer: data.file.buffer,
      filename: data.file.filename,
      mimeType: data.file.mimeType,
      originalName: data.file.originalName,
      fileSize: data.file.fileSize,
      purpose: "pictogram",
      isPrivate: false,
      userId: data.userId ?? undefined,
    });

    try {
      return await this._pictogramRepository.create({
        description: data.description,
        storedFileId: stored.id,
      });
    } catch (err) {
      await this._fileService.delete(stored.uuid);
      throw err;
    }
  }

  async findAll(): Promise<PictogramOutput[]> {
    return this._pictogramRepository.findAll();
  }

  async findById(id: number): Promise<PictogramOutput | null> {
    return this._pictogramRepository.findById(id);
  }

  async findByUuid(uuid: string): Promise<PictogramOutput | null> {
    return this._pictogramRepository.findByUuid(uuid);
  }

  async delete(id: number): Promise<void> {
    const pictogram = await this._pictogramRepository.findById(id);

    if (!pictogram) {
      throw new NotFoundError("Pictogram not found");
    }

    await this._pictogramRepository.delete(id);
    await this._fileService.delete(pictogram.fileUuid);
  }

  async deleteByUuid(uuid: string): Promise<void> {
    const pictogram = await this._pictogramRepository.findByUuid(uuid);

    if (!pictogram) {
      throw new NotFoundError("Pictogram not found");
    }

    await this._pictogramRepository.deleteByUuid(uuid);
    await this._fileService.delete(pictogram.fileUuid);
  }
}

export default PictogramService;

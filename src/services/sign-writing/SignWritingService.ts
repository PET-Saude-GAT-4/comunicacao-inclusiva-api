import { NotFoundError } from "@/errors/NotFoundError.js";
import type {
  SignWritingInput,
  SignWritingOutput,
} from "@/models/types/SignWriting.type.js";
import type { ISignWritingRepository } from "@/repositories/sign-writing/ISignWritingRepository.js";
import SignWritingRepository from "@/repositories/sign-writing/SignWritingRepository.js";
import FileService from "@/services/file/FileService.js";
import type { IFileService } from "@/services/file/IFileService.js";

import type { ISignWritingService } from "./ISignWritingService.js";

type Props = {
  signWritingRepository?: ISignWritingRepository;
  fileService?: IFileService;
};

class SignWritingService implements ISignWritingService {
  private _signWritingRepository: ISignWritingRepository;
  private _fileService: IFileService;

  constructor(props?: Props) {
    this._signWritingRepository =
      props?.signWritingRepository ?? new SignWritingRepository();
    this._fileService = props?.fileService ?? new FileService();
  }

  private async _remove(signWriting: SignWritingOutput): Promise<void> {
    await this._signWritingRepository.delete(signWriting.id);
    await this._fileService.delete(signWriting.fileUuid);
  }

  async create(data: SignWritingInput): Promise<SignWritingOutput> {
    const stored = await this._fileService.store({
      buffer: data.file.buffer,
      filename: data.file.filename,
      mimeType: data.file.mimeType,
      originalName: data.file.originalName,
      fileSize: data.file.fileSize,
      purpose: "sign-writing",
      isPrivate: false,
      userId: data.userId ?? undefined,
    });

    try {
      return await this._signWritingRepository.create({
        description: data.description,
        storedFileId: stored.id,
      });
    } catch (err) {
      await this._fileService.delete(stored.uuid);
      throw err;
    }
  }

  async findAll(): Promise<SignWritingOutput[]> {
    return this._signWritingRepository.findAll();
  }

  async findById(id: number): Promise<SignWritingOutput | null> {
    return this._signWritingRepository.findById(id);
  }

  async findByUuid(uuid: string): Promise<SignWritingOutput | null> {
    return this._signWritingRepository.findByUuid(uuid);
  }

  async delete(id: number): Promise<void> {
    const signWriting = await this._signWritingRepository.findById(id);

    if (!signWriting) {
      throw new NotFoundError("SignWriting not found");
    }

    await this._remove(signWriting);
  }

  async deleteByUuid(uuid: string): Promise<void> {
    const signWriting = await this._signWritingRepository.findByUuid(uuid);

    if (!signWriting) {
      throw new NotFoundError("SignWriting not found");
    }

    await this._remove(signWriting);
  }
}

export default SignWritingService;

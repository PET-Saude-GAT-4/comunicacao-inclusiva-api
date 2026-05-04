import path from "path";

import { env } from "@/config/env.js";
import type { FileType } from "@/models/types/StoredFile.type.js";

export class File {
  constructor(
    readonly id: number,
    readonly uuid: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,

    private _location: string,
    private _filename: string,
    private _originalName: string,
    private _fileSize: bigint | null,
    private _mimeType: string,
    private _fileType: FileType,
    private _purpose: string | null,
    private _isPrivate: boolean,
    private _userId: number | null,
  ) {}

  public get location(): string {
    return this._location;
  }

  public get filename(): string {
    return this._filename;
  }

  public get originalName(): string {
    return this._originalName;
  }

  public get fileSize(): bigint | null {
    return this._fileSize;
  }

  public get mimeType(): string {
    return this._mimeType;
  }

  public get fileType(): FileType {
    return this._fileType;
  }

  public get purpose(): string | null {
    return this._purpose;
  }

  public get isPrivate(): boolean {
    return this._isPrivate;
  }

  public get userId(): number | null {
    return this._userId;
  }

  public getFullLocation(): string {
    return path.join(path.resolve(env.fileStorageDir), this._location);
  }
}

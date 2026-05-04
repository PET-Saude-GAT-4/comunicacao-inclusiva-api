import type { File } from "@/models/File.js";
import type {
  FileSaveResult,
  FileStoreResult,
  StoredFileInput,
} from "@/models/types/StoredFile.type.js";

interface IFileService {
  store(file: StoredFileInput): Promise<FileStoreResult>;

  save(
    file: Pick<
      StoredFileInput,
      "originalName" | "mimeType" | "filename" | "fileSize" | "buffer"
    >,
    fileUuid?: string,
  ): Promise<FileSaveResult>;

  find(fileUuid: string): Promise<File | null>;

  delete(fileUuid: string): Promise<void>;
}

export type { IFileService };

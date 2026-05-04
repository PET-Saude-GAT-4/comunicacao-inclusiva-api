import type { File } from "@/models/File.js";
import type { StoredFileCreateData } from "@/models/types/StoredFile.type.js";

interface IFileRepository {
  create(data: StoredFileCreateData): Promise<File>;
  find(uuid: string): Promise<File | null>;
  delete(uuid: string): Promise<void>;
}

export type { IFileRepository };

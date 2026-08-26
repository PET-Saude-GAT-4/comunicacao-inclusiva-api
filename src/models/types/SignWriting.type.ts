import type { FileObject } from "@/models/types/StoredFile.type.js";

export type SignWritingInput = {
  description: string;
  file: FileObject;
  userId?: number | null;
};

export type SignWritingRepositoryInput = {
  description: string;
  storedFileId: number;
};

export type SignWritingOutput = {
  id: number;
  uuid: string;
  description: string;
  fileUuid: string;
  createdAt: Date;
  updatedAt: Date;
};

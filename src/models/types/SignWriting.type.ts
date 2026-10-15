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

// The authenticated list also names the terms that use each item, so the
// dashboard does not have to download every term to show them.
export type SignWritingListOutput = SignWritingOutput & {
  terms: { uuid: string; description: string }[];
};

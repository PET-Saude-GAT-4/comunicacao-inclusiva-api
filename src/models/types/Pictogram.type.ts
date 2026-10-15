import type { FileObject } from "@/models/types/StoredFile.type.js";

export type PictogramInput = {
  description: string;
  file: FileObject;
  userId?: number | null;
};

export type PictogramRepositoryInput = {
  description: string;
  storedFileId: number;
};

export type PictogramOutput = {
  id: number;
  uuid: string;
  description: string;
  fileUuid: string;
  createdAt: Date;
  updatedAt: Date;
};

// The authenticated list also names the terms that use each item, so the
// dashboard does not have to download every term to show them.
export type PictogramListOutput = PictogramOutput & {
  terms: { uuid: string; description: string }[];
};

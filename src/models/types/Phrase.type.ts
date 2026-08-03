import type { PictogramOutput } from "@/models/types/Pictogram.type.js";

export type PhraseInput = {
  description: string;
  pictogramUuids: string[];
};

export type PhraseUpdateInput = {
  description?: string | undefined;
  pictogramUuids?: string[] | undefined;
};

export type PhraseRepositoryInput = {
  description: string;
  authorId: number | null;
  pictogramIds: number[];
};

export type PhraseRepositoryUpdateInput = {
  description: string | undefined;
  pictogramIds: number[] | undefined;
};

export type PhraseOutput = {
  id: number;
  uuid: string;
  description: string;
  authorUuid: string | null;
  pictograms: PictogramOutput[];
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

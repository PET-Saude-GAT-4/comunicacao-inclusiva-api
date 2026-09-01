import type { PhraseItemOutput } from "@/models/types/PhraseItem.type.js";

export type PhraseInput = {
  description: string;
  termUuids: string[];
};

export type PhraseUpdateInput = {
  description?: string | undefined;
  termUuids?: string[] | undefined;
};

export type PhraseRepositoryInput = {
  description: string;
  authorId: number | null;
  termIds: number[];
};

export type PhraseRepositoryUpdateInput = {
  description: string | undefined;
  termIds: number[] | undefined;
};

export type PhraseOutput = {
  id: number;
  uuid: string;
  description: string;
  authorUuid: string | null;
  terms: PhraseItemOutput[];
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

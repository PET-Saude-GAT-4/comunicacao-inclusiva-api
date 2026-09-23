import type { PhraseTermOutput } from "@/models/types/PhraseTerm.type.js";

export type PhraseInput = {
  description: string;
  termUuids: string[];
  listedInLibrary?: boolean | undefined;
};

export type PhraseUpdateInput = {
  description?: string | undefined;
  termUuids?: string[] | undefined;
  listedInLibrary?: boolean | undefined;
};

export type PhraseRepositoryInput = {
  description: string;
  authorId: number | null;
  termIds: number[];
  listedInLibrary?: boolean | undefined;
};

export type PhraseRepositoryUpdateInput = {
  description: string | undefined;
  termIds: number[] | undefined;
  listedInLibrary: boolean | undefined;
};

export type PhraseOutput = {
  id: number;
  uuid: string;
  description: string;
  authorUuid: string | null;
  terms: PhraseTermOutput[];
  publishedAt: Date | null;
  listedInLibrary: boolean;
  createdAt: Date;
  updatedAt: Date;
};

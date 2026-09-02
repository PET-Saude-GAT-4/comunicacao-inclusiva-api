import type { TermOutput } from "@/models/types/Term.type.js";

export type BoardTermInput = {
  termUuid: string;
  // A BoardTerm uuid: the placement this one goes before, or null to append.
  next?: string | null;
};

export type BoardTermRepositoryInput = {
  boardId: number;
  termId: number;
  next: number | null;
};

export type BoardTermOutput = {
  id: number;
  uuid: string;
  term: TermOutput;
};

import type { TermOutput } from "@/models/types/Term.type.js";

export type BoardItemInput = {
  termUuid: string;
  // A BoardItem uuid: the placement this one goes before, or null to append.
  next?: string | null;
};

export type BoardItemRepositoryInput = {
  boardId: number;
  termId: number;
  next: number | null;
};

export type BoardItemOutput = {
  id: number;
  uuid: string;
  term: TermOutput;
};

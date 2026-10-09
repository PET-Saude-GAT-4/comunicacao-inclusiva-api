import type { BoardOutput } from "./Board.type.js";

// Mirrors the CHECK on TriageStep.level: there are always exactly five levels.
export const MIN_TRIAGE_LEVEL = 1;
export const MAX_TRIAGE_LEVEL = 5;

export type TriageStepInput = {
  boardUuid: string;
  level: number;
};

// A step only moves between levels. Putting a different board at a level is a
// delete and a create, which keeps the emergency check in one place.
export type TriageStepUpdateInput = {
  level: number;
};

export type TriageStepRepositoryInput = {
  boardId: number;
  level: number;
};

export type TriageStepFilter = {
  publishedOnly?: boolean;
};

export type TriageStepOutput = {
  id: number;
  uuid: string;
  level: number;
  board: BoardOutput;
  createdAt: Date;
  updatedAt: Date;
};

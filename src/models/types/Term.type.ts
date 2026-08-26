import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import type { SignWritingOutput } from "@/models/types/SignWriting.type.js";

export type TermInput = {
  pictogramUuid: string;
  signWritingUuid: string;
  description: string;
};

export type TermRepositoryInput = {
  pictogramId: number;
  signWritingId: number;
  description: string;
};

export type TermOutput = {
  id: number;
  uuid: string;
  description: string;
  pictogram: PictogramOutput;
  signWriting: SignWritingOutput;
  createdAt: Date;
  updatedAt: Date;
};

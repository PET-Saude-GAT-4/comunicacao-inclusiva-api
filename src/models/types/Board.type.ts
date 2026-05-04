import type { PictogramOutput } from "./Pictogram.type.js";

export type BoardInput = {
  title: string;
  authorId?: number | null;
  representativeUuid: string;
};

export type BoardRepositoryInput = {
  title: string;
  authorId?: number | null;
  representativeId: number;
};

export type BoardOutput = {
  id: number;
  uuid: string;
  title: string;
  representativePictogram: PictogramOutput;
  createdAt: Date;
  updatedAt: Date;
};

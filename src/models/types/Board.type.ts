import type { PictogramOutput } from "./Pictogram.type.js";

// Mirrors the BoardType enum in schema.prisma.
export const BOARD_TYPES = ["common", "emergency"] as const;

export type BoardType = (typeof BOARD_TYPES)[number];

export type BoardInput = {
  title: string;
  type?: BoardType | undefined;
  authorId?: number | null;
  representativeUuid: string;
};

export type BoardRepositoryInput = {
  title: string;
  type?: BoardType | undefined;
  authorId?: number | null;
  representativeId: number;
};

export type BoardUpdateInput = {
  title?: string | undefined;
  type?: BoardType | undefined;
  representativeUuid?: string | undefined;
};

export type BoardRepositoryUpdateInput = {
  title: string | undefined;
  type: BoardType | undefined;
  representativeId: number | undefined;
};

export type BoardFilter = {
  type?: BoardType | undefined;
};

export type BoardOutput = {
  id: number;
  uuid: string;
  title: string;
  type: BoardType;
  authorUuid: string | null;
  representativePictogram: PictogramOutput;
  termCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

import type { BoardOutput, BoardType } from "@/models/types/Board.type.js";
import type { PictogramRow } from "@/repositories/pictogram/PictogramMapper.js";
import { mapPictogramRow } from "@/repositories/pictogram/PictogramMapper.js";

type BoardRow = {
  id: number;
  uuid: string;
  title: string;
  type: BoardType;
  author: { uuid: string } | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  representative: PictogramRow;
  _count: { terms: number };
};

// Shared so any repository that reaches a board through a relation (next
// boards, triage steps) maps it the same way BoardRepository does.
const boardInclude = {
  representative: { include: { storedFile: true } },
  author: { select: { uuid: true } },
  _count: { select: { terms: true } },
} as const;

export function mapBoardRow(row: BoardRow): BoardOutput {
  return {
    id: row.id,
    uuid: row.uuid,
    title: row.title,
    type: row.type,
    authorUuid: row.author?.uuid ?? null,
    representativePictogram: mapPictogramRow(row.representative),
    termCount: row._count.terms,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export { boardInclude };
export type { BoardRow };

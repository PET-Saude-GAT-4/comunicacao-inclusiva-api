import type { TermOutput } from "@/models/types/Term.type.js";
import type { PictogramRow } from "@/repositories/pictogram/PictogramMapper.js";
import { mapPictogramRow } from "@/repositories/pictogram/PictogramMapper.js";
import type { SignWritingRow } from "@/repositories/sign-writing/SignWritingMapper.js";
import { mapSignWritingRow } from "@/repositories/sign-writing/SignWritingMapper.js";

type TermRow = {
  id: number;
  uuid: string;
  description: string;
  pictogram: PictogramRow;
  signWriting: SignWritingRow;
  createdAt: Date;
  updatedAt: Date;
};

// Reads must include both halves with their storedFile, so the controller has a
// fileUuid for each to turn into a fileUrl.
const termInclude = {
  pictogram: { include: { storedFile: true } },
  signWriting: { include: { storedFile: true } },
} as const;

export function mapTermRow(row: TermRow): TermOutput {
  return {
    id: row.id,
    uuid: row.uuid,
    description: row.description,
    pictogram: mapPictogramRow(row.pictogram),
    signWriting: mapSignWritingRow(row.signWriting),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export { termInclude };
export type { TermRow };

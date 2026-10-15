import type {
  PictogramListOutput,
  PictogramOutput,
} from "@/models/types/Pictogram.type.js";

type PictogramRow = {
  id: number;
  uuid: string;
  description: string;
  storedFile: { uuid: string };
  createdAt: Date;
  updatedAt: Date;
};

export function mapPictogramRow(row: PictogramRow): PictogramOutput {
  return {
    id: row.id,
    uuid: row.uuid,
    description: row.description,
    fileUuid: row.storedFile.uuid,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// Only the authenticated list includes the terms; /public/pictograms keeps the
// plain row.
export const pictogramListInclude = {
  storedFile: true,
  terms: { select: { uuid: true, description: true }, orderBy: { id: "asc" } },
} as const;

export function mapPictogramListRow(
  row: PictogramRow & { terms: { uuid: string; description: string }[] },
): PictogramListOutput {
  return { ...mapPictogramRow(row), terms: row.terms };
}

export type { PictogramRow };

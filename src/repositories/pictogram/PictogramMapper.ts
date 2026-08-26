import type { PictogramOutput } from "@/models/types/Pictogram.type.js";

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

export type { PictogramRow };

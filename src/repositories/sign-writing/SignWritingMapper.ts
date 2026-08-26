import type { SignWritingOutput } from "@/models/types/SignWriting.type.js";

type SignWritingRow = {
  id: number;
  uuid: string;
  description: string;
  storedFile: { uuid: string };
  createdAt: Date;
  updatedAt: Date;
};

export function mapSignWritingRow(row: SignWritingRow): SignWritingOutput {
  return {
    id: row.id,
    uuid: row.uuid,
    description: row.description,
    fileUuid: row.storedFile.uuid,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export type { SignWritingRow };

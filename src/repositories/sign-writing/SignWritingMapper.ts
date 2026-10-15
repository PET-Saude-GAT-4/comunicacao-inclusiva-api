import type {
  SignWritingListOutput,
  SignWritingOutput,
} from "@/models/types/SignWriting.type.js";

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

// Only the authenticated list includes the terms; /public/sign-writings keeps the
// plain row.
export const signWritingListInclude = {
  storedFile: true,
  terms: { select: { uuid: true, description: true }, orderBy: { id: "asc" } },
} as const;

export function mapSignWritingListRow(
  row: SignWritingRow & { terms: { uuid: string; description: string }[] },
): SignWritingListOutput {
  return { ...mapSignWritingRow(row), terms: row.terms };
}

export type { SignWritingRow };

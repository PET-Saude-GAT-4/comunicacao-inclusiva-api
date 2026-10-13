import { Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/prisma.js";

// Where a resource's search looks. Each repository declares its own as a
// constant, which keeps the searchable columns a fixed whitelist: no table or
// column name ever comes from the request.
export type SearchSource = {
  from: Prisma.Sql;
  id: Prisma.Sql;
  columns: Prisma.Sql[];
};

function toContainsPattern(q: string): string {
  // Backslash is Postgres' default LIKE escape, so "%" and "_" typed by the
  // user match themselves instead of acting as wildcards.
  return `%${q.replace(/[\\%_]/g, "\\$&")}%`;
}

// Prisma's where clause cannot call unaccent, so the accent-insensitive match
// runs as raw SQL that only returns ids. The caller then filters its regular
// findMany by them, keeping its typed include and mapper.
export async function matchingIds(
  q: string | undefined,
  source: SearchSource,
): Promise<{ in: number[] } | typeof Prisma.skip> {
  if (!q) return Prisma.skip;

  const pattern = toContainsPattern(q);
  const conditions = source.columns.map(
    (column) => Prisma.sql`unaccent(${column}) ILIKE unaccent(${pattern})`,
  );

  const rows = await prisma.$queryRaw<{ id: number }[]>`
    SELECT ${source.id} AS id FROM ${source.from}
    WHERE ${Prisma.join(conditions, " OR ")}
  `;

  return { in: rows.map((row) => row.id) };
}

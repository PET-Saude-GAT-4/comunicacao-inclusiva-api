import { Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/prisma.js";
import type { ListQuery } from "@/utils/pagination.js";

// What a resource's list reads from. Each repository declares its own as a
// constant, which keeps the searchable columns and the order a fixed
// whitelist: no table or column name ever comes from the request.
export type ListSource = {
  from: Prisma.Sql;
  id: Prisma.Sql;
  columns: Prisma.Sql[];
  orderBy: Prisma.Sql;
};

// Well under Postgres' 32,767 bind parameters, leaving room for the ones an
// include adds when Prisma loads the relations of the same ids.
const ID_CHUNK_SIZE = 10_000;

function toContainsPattern(q: string): string {
  // Backslash is Postgres' default LIKE escape, so "%" and "_" typed by the
  // user match themselves instead of acting as wildcards.
  return `%${q.replace(/[\\%_]/g, "\\$&")}%`;
}

// Prisma's where clause cannot call unaccent, so the list is selected in raw
// SQL: search, filters, order and page. Only the page's ids leave the
// database, which keeps the bind parameters constant however many rows match;
// handing every matching id back to Prisma broke past Postgres' limit.
// The caller's filters live here too, so the list honours them the same way
// with or without a search.
export async function pageIds(
  query: ListQuery,
  source: ListSource,
  filters: Prisma.Sql[] = [],
): Promise<{ ids: number[]; total: number }> {
  const conditions = [...filters];

  if (query.q) {
    const pattern = toContainsPattern(query.q);
    const matches = source.columns.map(
      (column) => Prisma.sql`unaccent(${column}) ILIKE unaccent(${pattern})`,
    );
    conditions.push(Prisma.sql`(${Prisma.join(matches, " OR ")})`);
  }

  const where =
    conditions.length > 0 ? Prisma.join(conditions, " AND ") : Prisma.sql`TRUE`;

  // A NULL limit means no limit, which is the unpaginated list.
  const take = query.page === undefined ? null : query.pageSize;
  const skip = query.page === undefined ? 0 : (query.page - 1) * query.pageSize;

  // The window count rides along with the page, so the common case is one
  // statement whose sort Postgres can stop at the page's end. bigint because
  // page has no upper bound and its offset can outgrow int.
  const rows = await prisma.$queryRaw<{ id: number; total: number }[]>`
    SELECT ${source.id} AS id, count(*) OVER ()::int AS total
    FROM ${source.from}
    WHERE ${where}
    ORDER BY ${source.orderBy}
    LIMIT ${take}::bigint OFFSET ${skip}::bigint
  `;

  if (rows.length > 0 || skip === 0) {
    return { ids: rows.map((row) => row.id), total: rows[0]?.total ?? 0 };
  }

  // A page past the end has no row to carry the count.
  const [counted] = await prisma.$queryRaw<{ total: number }[]>`
    SELECT count(*)::int AS total FROM ${source.from} WHERE ${where}
  `;

  return {
    ids: [],
    total: counted?.total ?? 0,
  };
}

// Loads rows by id and returns them in the order of `ids`, which findMany does
// not keep. A page always fits in one chunk; more only happen when a large
// list is requested without a page.
export async function findInOrder<T extends { id: number }>(
  ids: number[],
  fetch: (chunk: number[]) => Promise<T[]>,
): Promise<T[]> {
  const byId = new Map<number, T>();

  for (let i = 0; i < ids.length; i += ID_CHUNK_SIZE) {
    for (const row of await fetch(ids.slice(i, i + ID_CHUNK_SIZE))) {
      byId.set(row.id, row);
    }
  }

  // A row deleted between the two queries is skipped rather than returned as
  // undefined.
  return ids.flatMap((id) => {
    const row = byId.get(id);
    return row ? [row] : [];
  });
}

import { z } from "zod";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { formatZodError } from "@/utils/zod.js";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

// "?page=" reaches the server as an empty string, which would coerce to 0.
// Treating it as absent lets a client serialize an unset field without a 400.
const emptyAsAbsent = (value: unknown) => (value === "" ? undefined : value);

const listQuerySchema = z.object({
  page: z.preprocess(emptyAsAbsent, z.coerce.number().int().min(1).optional()),
  pageSize: z.preprocess(
    emptyAsAbsent,
    z.coerce
      .number()
      .int()
      .min(1)
      .max(MAX_PAGE_SIZE)
      .default(DEFAULT_PAGE_SIZE),
  ),
  q: z.string().trim().optional(),
});

// Pagination is opt-in: without a page the list comes back whole, so pickers
// that need every item keep working. pageSize alone is still validated but
// has no effect.
export type ListQuery = {
  page: number | undefined;
  pageSize: number;
  q: string | undefined;
};

export type ListMeta = {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type Page<T> = {
  items: T[];
  total: number;
};

export function parseListQuery(query: unknown): ListQuery {
  const parsed = listQuerySchema.safeParse(query);

  if (!parsed.success) {
    throw new BadRequestError(formatZodError(parsed.error).join("; "));
  }

  return {
    page: parsed.data.page,
    pageSize: parsed.data.pageSize,
    q: parsed.data.q || undefined,
  };
}

export function buildListMeta(query: ListQuery, total: number): ListMeta {
  if (query.page === undefined) {
    return { total, page: 1, pageSize: total, pageCount: total > 0 ? 1 : 0 };
  }

  return {
    total,
    page: query.page,
    pageSize: query.pageSize,
    pageCount: Math.ceil(total / query.pageSize),
  };
}

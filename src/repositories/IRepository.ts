import type { ListQuery, Page } from "@/utils/pagination.js";

interface IRepository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  findPage?(query: ListQuery): Promise<Page<T>>;
  existsById?(id: number): Promise<boolean>;
  delete(id: number): Promise<void>;
}

export type { IRepository };

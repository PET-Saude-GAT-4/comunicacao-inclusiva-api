import type { ListQuery, Page } from "@/utils/pagination.js";

interface IService<T> {
  findById?(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  findPage?(query: ListQuery): Promise<Page<T>>;
  delete(id: number): Promise<void>;
}

export type { IService };

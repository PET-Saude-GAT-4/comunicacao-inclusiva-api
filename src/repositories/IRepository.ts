interface IRepository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  existsById?(id: number): Promise<boolean>;
  delete(id: number): Promise<void>;
}

export type { IRepository };

interface IRepository<T> {
  findById(id: number): Promise<T>;
  findAll(): Promise<T[]>;
  existsById?(id: number): Promise<boolean>;
  delete(id: number): Promise<void>;
}

export type { IRepository };

interface IRepository<T> {
  findById(id: number): Promise<T>;
  findAll(): Promise<T[]>;
  existsById(id: number): Promise<boolean>;
  delete(id: number): Promise<T>;
}

export type { IRepository };

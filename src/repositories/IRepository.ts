interface IRepository<T> {
  findById(id: number): Promise<T | null>;
  // Optional because most list endpoints page through findPage instead; only
  // the lists the public API serves whole still need it.
  findAll?(): Promise<T[]>;
  existsById?(id: number): Promise<boolean>;
  delete(id: number): Promise<void>;
}

export type { IRepository };

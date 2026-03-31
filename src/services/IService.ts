interface IService<T> {
  findById?(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: number): Promise<void>;
}

export type { IService };

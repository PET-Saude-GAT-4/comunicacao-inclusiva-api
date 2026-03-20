interface IService<T> {
  findById?(id: number): Promise<T>;
  findAll(): Promise<T[]>;
  create(value: Partial<T>): Promise<T>;
  update?(id: number, value: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

export type { IService };

import type { RoleInput, RoleOutput } from "@/models/types/Role.type.js";
import type { ListQuery, Page } from "@/utils/pagination.js";

interface IRoleService {
  create(name: string): Promise<RoleOutput>;

  findById(id: number): Promise<RoleOutput | null>;

  findAll(): Promise<RoleOutput[]>;

  findPage(query: ListQuery): Promise<Page<RoleOutput>>;

  update(id: number, data: RoleInput): Promise<RoleOutput>;

  delete(id: number): Promise<void>;
}

export type { IRoleService };

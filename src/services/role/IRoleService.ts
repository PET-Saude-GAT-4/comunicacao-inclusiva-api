import type { RoleInput, RoleOutput } from "@/models/types/Role.type.js";

interface IRoleService {
  create(name: string): Promise<RoleOutput>;

  findById(id: number): Promise<RoleOutput | null>;

  findAll(): Promise<RoleOutput[]>;

  update(id: number, data: RoleInput): Promise<RoleOutput>;

  delete(id: number): Promise<void>;
}

export type { IRoleService };

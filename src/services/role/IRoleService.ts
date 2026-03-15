import type { Role } from "@/models/Role.js";

interface IRoleService {
  create(name: string): Promise<Role>;

  findById(id: number): Promise<Role>;

  findAll(): Promise<Role[]>;

  update(id: number, name: string): Promise<Role>;

  delete(id: number): Promise<Role>;
}

export type { IRoleService };

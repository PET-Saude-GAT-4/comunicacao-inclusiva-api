import type { Role } from "@/models/Role.js";
import type { IRoleRepository } from "./IRoleRepository.js";

class RoleRepository implements IRoleRepository {
  async create(value: Partial<Role>): Promise<Role> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<Role[]> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default RoleRepository;

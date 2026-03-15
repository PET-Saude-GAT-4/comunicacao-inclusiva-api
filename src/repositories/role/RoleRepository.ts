import type { IRoleRepository } from "./IRoleRepository.js";

class RoleRepository implements IRoleRepository {
  async create(value: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

export default RoleRepository;

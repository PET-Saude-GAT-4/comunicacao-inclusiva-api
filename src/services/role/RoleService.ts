import type { IRoleRepository } from "@/repositories/role/IRoleRepository.js";
import RoleRepository from "@/repositories/role/RoleRepository.js";

import type { IRoleService } from "./IRoleService.js";

import type { Role } from "@/models/Role.js";

type Props = {
  roleRepository?: IRoleRepository;
};

class RoleService implements IRoleService {
  private _roleRepository: IRoleRepository;

  constructor(props?: Props) {
    this._roleRepository = props?.roleRepository ?? new RoleRepository();
  }

  async create(value: Partial<Role>): Promise<Role> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<Role[]> {
    throw new Error("Method not implemented.");
  }
}

export default RoleService;

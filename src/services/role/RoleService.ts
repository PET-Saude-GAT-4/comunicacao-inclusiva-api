import type { RoleInput, RoleOutput } from "@/models/types/Role.type.js";
import type { IRoleRepository } from "@/repositories/role/IRoleRepository.js";
import RoleRepository from "@/repositories/role/RoleRepository.js";

import type { IRoleService } from "./IRoleService.js";

type Props = {
  roleRepository?: IRoleRepository;
};

class RoleService implements IRoleService {
  private _roleRepository: IRoleRepository;

  constructor(props?: Props) {
    this._roleRepository = props?.roleRepository ?? new RoleRepository();
  }

  async create(name: string): Promise<RoleOutput> {
    const RoleInput: RoleInput = { name };

    return this._roleRepository.create(RoleInput);
  }

  async findById(id: number): Promise<RoleOutput> {
    const role = await this._roleRepository.findById(id);

    if (!role) {
      throw new Error("Role not found.");
    }
    return role;
  }

  async findAll(): Promise<RoleOutput[]> {
    return this._roleRepository.findAll();
  }

  async update(id: number, data: RoleInput): Promise<RoleOutput> {
    if (data.name == undefined) {
      throw new Error("No valid fields to update");
    }

    return this._roleRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this._roleRepository.delete(id);
  }
}

export default RoleService;

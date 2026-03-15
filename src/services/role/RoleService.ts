import type { Role } from "@/models/Role.js";
import { prisma } from "@/prisma.js";
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

  async create(name: string): Promise<Role> {
    try {
      const role = await prisma.role.create({
        data: { name },
      }); // TODO: implement the create method in RoleRepository
      return role;
    } catch (error) {
      console.error(`Error creating role: ${error}`);
      throw error;
    }
  }

  async findById(id: number): Promise<Role> {
    return this._roleRepository.findById(id);
  }

  async findAll(): Promise<Role[]> {
    return this._roleRepository.findAll();
  }

  async update(id: number, name: string): Promise<Role> {
    return this._roleRepository.update(id, name);
  }

  async delete(id: number): Promise<Role> {
    return this._roleRepository.delete(id);
  }
}

export default RoleService;

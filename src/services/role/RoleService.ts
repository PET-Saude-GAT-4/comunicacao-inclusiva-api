import type { RoleInput, RoleOutput } from "@/models/types/Role.type.js";
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

  async create(name: string): Promise<RoleOutput> {
    try {
      const role = await prisma.role.create({
        data: { name },
      }); // TODO: implement the create method in RoleRepository
      return {
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        id: role.id,
      };
    } catch (error) {
      console.error(`Error creating role: ${error}`);
      throw error;
    }
  }

  async findById(id: number): Promise<RoleOutput> {
    return this._roleRepository.findById(id);
  }

  async findAll(): Promise<RoleOutput[]> {
    return this._roleRepository.findAll();
  }

  async update(id: number, data: RoleInput): Promise<RoleOutput> {
    if(data.name == undefined) {
      throw new Error("No valid fields to update");
    }

    return this._roleRepository.update(id, data);
  }

  async delete(id: number): Promise<RoleOutput> {
    return this._roleRepository.delete(id);
  }
}

export default RoleService;

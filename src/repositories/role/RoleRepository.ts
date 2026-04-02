import type { RoleInput, RoleOutput } from "@/models/types/Role.type.js";
import type { UserOutput } from "@/models/types/User.type.js";
import { prisma } from "@/prisma.js";

import type { IRoleRepository } from "./IRoleRepository.js";

class RoleRepository implements IRoleRepository {
  // Repo specific methods
  async findById(id: number): Promise<RoleOutput | null> {
    const role = await prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) return null;

    return {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  async findAll(): Promise<RoleOutput[]> {
    const roles = await prisma.role.findMany();
    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));
  }

  async existsById(id: number): Promise<boolean> {
    const roleCount: number = await prisma.role.count({ where: { id } });

    return roleCount > 0;
  }

  async delete(id: number): Promise<void> {
    await prisma.role.deleteMany({
      where: { id },
    });
  }

  // Custom methods
  async create(data: RoleInput): Promise<RoleOutput> {
    const role = await prisma.role.create({
      data: {
        name: data.name,
      },
    });
    return {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  async findAttributedUsers(id: number): Promise<UserOutput[]> {
    const users = await prisma.user.findMany({
      where: {
        roleId: id,
      },
    });
    return users.map((user) => ({
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async update(id: number, data: RoleInput): Promise<RoleOutput> {
    const role = await prisma.role.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });
    return {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}

export default RoleRepository;

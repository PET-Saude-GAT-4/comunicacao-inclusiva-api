import type { RoleInput, RoleOutput } from "@/models/types/Role.type.js";
import type { UserOutput } from "@/models/types/User.type.js";
import { prisma } from "@/prisma.js";

import type { IRoleRepository } from "./IRoleRepository.js";

class RoleRepository implements IRoleRepository {
  // Repo specific methods
  async findById(id: number): Promise<RoleOutput> {
    try {
      const role = await prisma.role.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return {
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };
    } catch (error) {
      console.error(`Error finding role by id: ${error}`);
      throw error;
    }
  }

  async findAll(): Promise<RoleOutput[]> {
    try {
      const roles = await prisma.role.findMany();
      return roles.map((role) => ({
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      }));
    } catch (error) {
      console.error(`Error finding all roles: ${error}`);
      throw error;
    }
  }

  async existsById(id: number): Promise<boolean> {
    try {
      const roleCount: number = await prisma.role.count({ where: { id } });

      return roleCount > 0;
    } catch (error) {
      console.error(`Error checking if role exists by id: ${error}`);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.role.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(`Error deleting role: ${error}`);
      throw error;
    }
  }

  // Custom methods
  async create(data: RoleInput): Promise<RoleOutput> {
    try {
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
    } catch (error) {
      console.error();
      throw error;
    }
  }

  async findAttributedUsers(id: number): Promise<UserOutput[]> {
    try {
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
    } catch (error) {
      console.error(`Error finding all attributed users for role: ${error}`);
      throw error;
    }
  }

  async update(id: number, data: RoleInput): Promise<RoleOutput> {
    try {
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
    } catch (error) {
      console.error(`Error updating role: ${error}`);
      throw error;
    }
  }
}

export default RoleRepository;

import type { Role } from "@/models/Role.js";
import type { User } from "@/models/User.js";
import { prisma } from "@/prisma.js";

import type { IRoleRepository } from "./IRoleRepository.js";

class RoleRepository implements IRoleRepository {
  // Repo specific methods
  async findById(id: number): Promise<Role> {
    try {
      const role = await prisma.role.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return role;
    } catch (error) {
      console.log(`Error finding role by id: ${error}`);
      throw error;
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      const roles = await prisma.role.findMany();
      return roles;
    } catch (error) {
      console.log(`Error finding all roles: ${error}`);
      throw error;
    }
  }

  async existsById(id: number): Promise<boolean> {
    try {
      const roleCount: number = await prisma.role.count({ where: { id } });

      if (roleCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(`Error checking if role exists by id: ${error}`);
      throw error;
    }
  }

  async delete(id: number): Promise<Role> {
    try {
      const role = await prisma.role.delete({
        where: {
          id,
        },
      });
      return role;
    } catch (error) {
      console.log(`Error deleting role: ${error}`);
      throw error;
    }
  }

  // Custom methods
  async findAttributedUsers(id: number): Promise<User[]> {
    try {
      const role = await this.findById(id);
      const users = await prisma.user.findMany({
        where: {
          roleId: role.id,
        },
      });
      return users;
    } catch (error) {
      console.log(`Error finding all attributed users for role: ${error}`);
      throw error;
    }
  }

  async update(id: number, name: string): Promise<Role> {
    try {
      const role = await prisma.role.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });
      return role;
    } catch (error) {
      console.log(`Error updating role: ${error}`);
      throw error;
    }
  }
}

export default RoleRepository;

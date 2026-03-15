import type {
  UserInput,
  UserOutput,
  UserUpdateInput,
} from "@/models/types/User.type.js";
import { prisma } from "@/prisma.js";

import type { IUserRepository } from "./IUserRepository.js";

class UserRepository implements IUserRepository {
  // Repo specific methods
  async findById(id: number): Promise<UserOutput> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error(`Error finding user by id: ${error}`);
      throw error;
    }
  }

  async findAll(): Promise<UserOutput[]> {
    try {
      const users = await prisma.user.findMany();
      return users.map((user) => ({
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    } catch (error) {
      console.error(`Error finding all users: ${error}`);
      throw error;
    }
  }

  async existsById(id: number): Promise<boolean> {
    try {
      const userCount: number = await prisma.user.count({ where: { id } });

      return userCount > 0;
    } catch (error) {
      console.error(`Error checking if user exists by id: ${error}`);
      throw error;
    }
  }

  async delete(id: number): Promise<UserOutput> {
    try {
      const user = await prisma.user.delete({
        where: {
          id,
        },
      });
      return {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error(`Error deleting user: ${error}`);
      throw error;
    }
  }

  // Custom methods
  async create(data: UserInput): Promise<UserOutput> {
    try {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          role: { connect: { id: data.roleId } },
        },
      });
      return {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error(`Error creating user: ${error}`);
      throw error;
    }
  }

  async update(id: number, data: UserUpdateInput): Promise<UserOutput> {
    try {
      const query: Partial<UserUpdateInput> = {};

      if (
        data.email == undefined &&
        data.passwordHash == undefined &&
        data.roleId == undefined
      ) {
        throw new Error("No valid fields to update");
      }

      if (data.email != undefined) {
        query.email = data.email;
      }

      if (data.passwordHash != undefined) {
        query.passwordHash = data.passwordHash;
      }

      if (data.roleId != undefined) {
        query.roleId = data.roleId;
      }

      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          ...query,
        },
      });
      return {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error(`Error updating user: ${error}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserOutput> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });

      return {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error(`Error finding user by email: ${error}`);
      throw error;
    }
  }

  async findByUuid(uuid: string): Promise<UserOutput> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          uuid: uuid,
        },
      });

      return {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error(`Error finding user by uuid: ${error}`);
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const userCount: number = await prisma.user.count({ where: { email } });

      return userCount > 0;
    } catch (error) {
      console.error(`Error checking if user exists by email: ${error}`);
      throw error;
    }
  }

  async existsByUuid(uuid: string): Promise<boolean> {
    try {
      const userCount: number = await prisma.user.count({ where: { uuid } });

      return userCount > 0;
    } catch (error) {
      console.error(`Error checking if user exists by UUID: ${error}`);
      throw error;
    }
  }
}

export default UserRepository;

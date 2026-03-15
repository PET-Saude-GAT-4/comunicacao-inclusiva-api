import type { User } from "@/models/User.js";
import { prisma } from "@/prisma.js";

import type { IUserRepository } from "./IUserRepository.js";

class UserRepository implements IUserRepository {
  // Repo specific methods
  async findById(id: number) {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      console.error(`Error finding user by id: ${error}`);
      throw error;
    }
  }
  async findAll() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error(`Error finding all users: ${error}`);
      throw error;
    }
  }

  async existsById(id: number): Promise<boolean> {
    try {
      const userCount: number = await prisma.user.count({ where: { id } });

      if (userCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(`Error checking if user exists by id: ${error}`);
      throw error;
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const user = await prisma.user.delete({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      console.log(`Error deleting user: ${error}`);
      throw error;
    }
  }

  // Custom methods
  async create(email: string, passwordHash: string): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          email: email,
          passwordHash: passwordHash,
        },
      });
      return user;
    } catch (error) {
      console.error(`Error creating user: ${error}`);
      throw error;
    }
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
        },
      });
      return user;
    } catch (error) {
      console.error(`Error updating user: ${error}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });

      return user;
    } catch (error) {
      console.error(`Error finding user by email: ${error}`);
      throw error;
    }
  }

  async findByUuid(uuid: string): Promise<User> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          uuid: uuid,
        },
      });

      return user;
    } catch (error) {
      console.error(`Error finding user by uuid: ${error}`);
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const userCount: number = await prisma.user.count({ where: { email } });

      if (userCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(`Error checking if user exists by email: ${error}`);
      throw error;
    }
  }

  async existsByUuid(uuid: string): Promise<boolean> {
    try {
      const userCount: number = await prisma.user.count({ where: { uuid } });

      if (userCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(`Error checking if user exists by UUID: ${error}`);
      throw error;
    }
  }

  async roleConnect(id: number, roleId: number): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          role: { connect: { id: roleId } },
        },
      });
      return user;
    } catch (error) {
      console.error(`Error updating user role: ${error}`);
      throw error;
    }
  }

  async roleDisconnect(id: number): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          role: { disconnect: true },
        },
      });
      return user;
    } catch (error) {
      console.error(`Error disconnecting user role: ${error}`);
      throw error;
    }
  }
}

export default UserRepository;

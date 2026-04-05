import type {
  UserInput,
  UserOutput,
  UserUpdateInput,
} from "@/models/types/User.type.js";
import { prisma } from "@/prisma.js";

import type { IUserRepository } from "./IUserRepository.js";

class UserRepository implements IUserRepository {
  // Repo specific methods
  async findById(id: number): Promise<UserOutput | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: { role: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findAll(): Promise<UserOutput[]> {
    const users = await prisma.user.findMany({ include: { role: true } });
    return users.map((user) => ({
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async existsById(id: number): Promise<boolean> {
    const userCount: number = await prisma.user.count({ where: { id } });

    return userCount > 0;
  }

  async delete(id: number): Promise<void> {
    await prisma.user.deleteMany({
      where: { id },
    });
  }

  // Custom methods
  async create(data: UserInput): Promise<UserOutput> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: { connect: { id: data.roleId } },
      },
      include: { role: true },
    });
    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(id: number, data: UserUpdateInput): Promise<UserOutput> {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
      include: { role: true },
    });
    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<UserOutput | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: { role: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByUuid(uuid: string): Promise<UserOutput | null> {
    const user = await prisma.user.findUnique({
      where: {
        uuid: uuid,
      },
      include: { role: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findPasswordHashByEmail(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        passwordHash: true,
      },
    });

    return user?.passwordHash ?? null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const userCount: number = await prisma.user.count({ where: { email } });

    return userCount > 0;
  }

  async existsByUuid(uuid: string): Promise<boolean> {
    const userCount: number = await prisma.user.count({ where: { uuid } });

    return userCount > 0;
  }
}

export default UserRepository;

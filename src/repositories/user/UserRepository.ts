import { Prisma } from "@/generated/prisma/client.js";
import type {
  UserInput,
  UserOutput,
  UserUpdateInput,
} from "@/models/types/User.type.js";
import { prisma } from "@/prisma.js";
import { matchingIds, type SearchSource } from "@/repositories/search.js";
import { type ListQuery, type Page, pageArgs } from "@/utils/pagination.js";

import type { IUserRepository } from "./IUserRepository.js";

const search: SearchSource = {
  from: Prisma.sql`"User"`,
  id: Prisma.sql`"User"."id"`,
  columns: [Prisma.sql`"User"."email"`],
};

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
      confirmedAt: user.confirmedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findPage(query: ListQuery): Promise<Page<UserOutput>> {
    const where = { id: await matchingIds(query.q, search) };

    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        ...pageArgs(query),
        include: { role: true },
      }),
    ]);

    const items = users.map((user) => ({
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      confirmedAt: user.confirmedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return { items, total };
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
        confirmedAt: data.confirmedAt ?? null,
        role: { connect: { id: data.roleId } },
      },
      include: { role: true },
    });
    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      confirmedAt: user.confirmedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(id: number, data: UserUpdateInput): Promise<UserOutput> {
    const { password, passwordHash, ...rest } = data;
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...rest,
        ...(password !== undefined || passwordHash !== undefined
          ? { passwordHash: passwordHash ?? password }
          : {}),
      },
      include: { role: true },
    });
    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      confirmedAt: user.confirmedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updatePassword(id: number, password: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { passwordHash: password },
    });
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
      confirmedAt: user.confirmedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByUuid(uuid: string): Promise<UserOutput | null> {
    const user = await prisma.user.findUnique({
      where: {
        uuid,
      },
      include: { role: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      confirmedAt: user.confirmedAt,
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

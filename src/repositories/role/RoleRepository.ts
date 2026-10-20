import { Prisma } from "@/generated/prisma/client.js";
import type { RoleInput, RoleOutput } from "@/models/types/Role.type.js";
import type { UserOutput } from "@/models/types/User.type.js";
import { prisma } from "@/prisma.js";
import {
  findInOrder,
  type ListSource,
  pageIds,
} from "@/repositories/search.js";
import type { ListQuery, Page } from "@/utils/pagination.js";

import type { IRoleRepository } from "./IRoleRepository.js";

const source: ListSource = {
  from: Prisma.sql`"Role"`,
  id: Prisma.sql`"Role"."id"`,
  columns: [Prisma.sql`"Role"."name"`],
  orderBy: Prisma.sql`"Role"."createdAt" DESC, "Role"."id" DESC`,
};

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

  async findPage(query: ListQuery): Promise<Page<RoleOutput>> {
    const { ids, total } = await pageIds(query, source);
    const roles = await findInOrder(ids, (rowIds) =>
      prisma.role.findMany({
        where: { id: { in: rowIds } },
      }),
    );

    const items = roles.map((role) => ({
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));

    return { items, total };
  }

  async findByName(name: string): Promise<RoleOutput | null> {
    const role = await prisma.role.findUnique({
      where: { name },
    });

    if (!role) return null;

    return {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
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
      include: { role: true },
    });
    return users.map((user) => ({
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      confirmedAt: user.confirmedAt,
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

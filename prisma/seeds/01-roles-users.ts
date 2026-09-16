import bcrypt from "bcryptjs";

import type { PrismaClient } from "../../src/generated/prisma/client.js";
import { RoleEnum } from "../../src/models/types/Role.type.js";

export async function seedRolesAndUsers(prisma: PrismaClient): Promise<void> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is required");
  }

  const roles = [];
  for (const role of Object.values(RoleEnum)) {
    const r = await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });

    roles.push(r);
  }

  const superAdminRole = roles.find(
    (role) => role.name === RoleEnum.SUPER_ADMIN,
  )!;

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: "admin@admin.admin" },
    update: {},
    create: {
      email: "admin@admin.admin",
      passwordHash,
      roleId: superAdminRole.id,
    },
  });
}

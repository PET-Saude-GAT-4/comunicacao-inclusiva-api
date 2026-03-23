import bcrypt from "bcryptjs";

import { prisma } from "../src/prisma.js";

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is required");
  }

  const roles = [];
  for (const role of ["super_admin", "admin", "viewer"]) {
    const r = await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });

    roles.push(r);
  }

  const superAdminRole = roles.find((role) => role.name === "super_admin")!;

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

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import crypto from "node:crypto";

import bcrypt from "bcryptjs";

import { env } from "@/config/env.js";
import { RoleEnum, type RoleName } from "@/models/types/Role.type.js";
import type { TokenPurpose } from "@/models/types/UserToken.type.js";
import { prisma } from "@/prisma.js";

import { assertTestDatabase } from "./test-env.js";

export { prisma };

let truncateStatement: string | undefined;

/** Empties every table, so each test starts from nothing and sets up its own data. */
export async function resetDatabase(): Promise<void> {
  assertTestDatabase(env.databaseUrl);

  // The tables do not change during a run, so the catalog is read once.
  if (truncateStatement === undefined) {
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
    `;
    const list = tables
      .map(({ tablename }) => `"public"."${tablename}"`)
      .join(", ");
    truncateStatement = `TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`;
  }

  await prisma.$executeRawUnsafe(truncateStatement);
}

type CreateUserOptions = {
  email: string;
  password?: string;
  confirmed?: boolean;
  role?: RoleName;
};

export async function createUser({
  email,
  password,
  confirmed = true,
  role = RoleEnum.ADMIN,
}: CreateUserOptions) {
  const roleRecord = await prisma.role.upsert({
    where: { name: role },
    update: {},
    create: { name: role },
  });

  return prisma.user.create({
    data: {
      email,
      roleId: roleRecord.id,
      // A low cost keeps the suite fast; login only needs bcrypt.compare to match.
      passwordHash: password ? await bcrypt.hash(password, 4) : null,
      confirmedAt: confirmed ? new Date() : null,
    },
  });
}

type CreateTokenOptions = {
  userId: number;
  purpose: TokenPurpose;
  expiresAt?: Date;
  usedAt?: Date | null;
};

/**
 * Inserts a token the way the services store it and returns the raw value a
 * user would receive: password-reset tokens are stored as a SHA-256 hash,
 * invitation tokens as they are.
 */
export async function createToken({
  userId,
  purpose,
  expiresAt = new Date(Date.now() + 60 * 60 * 1000),
  usedAt = null,
}: CreateTokenOptions): Promise<string> {
  const raw = crypto.randomBytes(32).toString("hex");
  const stored =
    purpose === "PASSWORD_RESET"
      ? crypto.createHash("sha256").update(raw).digest("hex")
      : raw;

  await prisma.userToken.create({
    data: { token: stored, userId, purpose, expiresAt, usedAt },
  });

  return raw;
}

import dotenv from "dotenv";
import path from "path";

const nodeEnv = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${nodeEnv}`),
  override: true,
});

import { z } from "zod";

import { formatZodError } from "@/utils/zod.js";

const envSchema = z.object({
  APP_BASE_URL: z.url(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("1d"),
  FILE_STORAGE_DIR: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number(),
  SMTP_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().min(1),
  INVITATION_EXPIRES_HOURS: z.coerce.number().default(168),
  MIN_PASSWORD_LENGTH: z.coerce.number().default(8),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");

  for (const errorMessage of formatZodError(parsedEnv.error))
    console.error(`- ${errorMessage}`);

  process.exit(1);
}

export const env = {
  appBaseUrl: parsedEnv.data.APP_BASE_URL,
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  databaseUrl: parsedEnv.data.DATABASE_URL,
  jwtSecret: parsedEnv.data.JWT_SECRET,
  jwtExpiresIn: parsedEnv.data.JWT_EXPIRES_IN,
  fileStorageDir: parsedEnv.data.FILE_STORAGE_DIR,
  smtpHost: parsedEnv.data.SMTP_HOST,
  smtpPort: parsedEnv.data.SMTP_PORT,
  smtpSecure: parsedEnv.data.SMTP_SECURE,
  smtpUser: parsedEnv.data.SMTP_USER,
  smtpPass: parsedEnv.data.SMTP_PASS,
  smtpFrom: parsedEnv.data.SMTP_FROM,
  invitationExpiresHours: parsedEnv.data.INVITATION_EXPIRES_HOURS,
  minPasswordLength: parsedEnv.data.MIN_PASSWORD_LENGTH,
};

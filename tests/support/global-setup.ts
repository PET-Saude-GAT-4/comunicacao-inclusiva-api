import { execSync } from "node:child_process";

// Jest does not apply moduleNameMapper to globalSetup, so the .ts source is
// imported directly.
import { loadTestEnv } from "./test-env.ts";

export default function globalSetup(): void {
  const databaseUrl = loadTestEnv();

  // prisma.config.ts loads .env through dotenv/config, which never overrides a
  // variable that is already set, so the test DATABASE_URL passed here wins.
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
}

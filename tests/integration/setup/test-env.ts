import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";

const envTestPath = path.resolve(process.cwd(), ".env.test");

/**
 * Loads .env.test into process.env and returns the test DATABASE_URL, refusing
 * any database whose name does not end in `_test`: the integration suite
 * truncates every table, and pointing it at the dev database would wipe it.
 */
export function loadTestEnv(): string {
  if (!fs.existsSync(envTestPath)) {
    throw new Error(
      "Missing .env.test. Copy .env.test.example to .env.test and adjust it.",
    );
  }

  dotenv.config({ path: envTestPath, override: true, quiet: true });

  const url = process.env["DATABASE_URL"];
  if (!url) throw new Error(".env.test must define DATABASE_URL.");

  assertTestDatabase(url);
  return url;
}

export function assertTestDatabase(url: string): void {
  const databaseName = new URL(url).pathname.replace(/^\//, "");

  if (!databaseName.endsWith("_test")) {
    throw new Error(
      `Refusing to run integration tests against "${databaseName}": the database name must end in "_test".`,
    );
  }
}

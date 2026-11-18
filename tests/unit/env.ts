// src/config/env.ts exits the process when a required variable is missing.
// Unit tests never touch the database or SMTP, so placeholders are enough
// when no .env is present (as in CI).
const placeholders: Record<string, string> = {
  API_BASE_URL: "http://localhost:8080",
  FRONTEND_BASE_URL: "http://localhost:3000",
  DATABASE_URL: "postgresql://unused:unused@localhost:5432/unused",
  JWT_SECRET: "unit-test-secret-that-is-at-least-32-characters",
  FILE_STORAGE_DIR: "./uploads",
  SMTP_HOST: "localhost",
  SMTP_PORT: "1025",
  SMTP_FROM: "noreply@test.local",
};

for (const [name, value] of Object.entries(placeholders)) {
  process.env[name] ??= value;
}

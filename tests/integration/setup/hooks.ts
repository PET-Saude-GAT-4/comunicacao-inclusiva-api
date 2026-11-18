import { afterAll, beforeAll, beforeEach, jest } from "@jest/globals";

import { ErrorBase } from "@/errors/base.error.js";

import { outbox } from "../../mocks/nodemailer.js";
import { prisma, resetDatabase } from "../helpers/db.js";

beforeAll(() => {
  // ErrorHandlerMiddleware logs every error, including the 4xx responses these
  // tests provoke on purpose. Only unexpected errors are worth printing.
  const log = console.error.bind(console);
  jest.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    if (args[0] instanceof ErrorBase) return;
    log(...args);
  });
});

beforeEach(async () => {
  await resetDatabase();
  outbox.length = 0;
});

afterAll(async () => {
  await prisma.$disconnect();
});

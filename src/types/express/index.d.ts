import type { AuthenticatedUser } from "../user.ts";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthenticatedUser;
  }
}

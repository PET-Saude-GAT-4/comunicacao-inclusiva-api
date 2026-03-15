import type { NextFunction, Request, Response } from "express";

interface IAuthMiddleware {
  auth(
    allowedRoles?: "all" | string[],
  ): (req: Request, res: Response, next: NextFunction) => void;
}

export type { IAuthMiddleware };

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/config/env.js";
import { AccountNotConfirmedError } from "@/errors/AccountNotConfirmedError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";

import type { IAuthMiddleware } from "./IAuthMiddleware.js";

class AuthMiddleware implements IAuthMiddleware {
  private validate(req: Request, res: Response, required: boolean): boolean {
    const authorization = req.headers.authorization;

    if (!authorization) {
      delete req.user;
      if (required) {
        throw new UnauthorizedError("Token not provided.");
      }
      return !required;
    }

    const [prefix, token] = authorization.split(" ");

    if (prefix !== "Bearer" || !token) {
      delete req.user;
      if (required) {
        throw new UnauthorizedError("Malformed token.");
      }
      return !required;
    }

    let decoded: jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;
    } catch {
      delete req.user;
      if (required) {
        throw new UnauthorizedError("Invalid or expired token.");
      }
      return !required;
    }

    const { id, uuid, email, role, confirmed } = decoded;

    if (required && !confirmed) {
      delete req.user;
      throw new AccountNotConfirmedError();
    }

    req.user = {
      id: id,
      uuid: uuid,
      email: email,
      role: role,
      confirmed: !!confirmed,
    };

    return true;
  }

  public auth(
    allowedRoles?: "all" | string[],
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      const isValid = this.validate(req, res, !!allowedRoles);

      if (!isValid) return;

      if (!allowedRoles || allowedRoles === "all") return next();

      if (!req.user || !allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError("Role not allowed.");
      }

      return next();
    };
  }
}

export default AuthMiddleware;

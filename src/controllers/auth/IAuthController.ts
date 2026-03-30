import type { NextFunction, Request, Response } from "express";

interface IAuthController {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;

  checkToken(req: Request, res: Response, next: NextFunction): Promise<void>;

  register(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export type { IAuthController };

import type { Request, Response } from "express";

interface IAuthController {
  login(req: Request, res: Response): Promise<void>;

  checkToken(req: Request, res: Response): Promise<void>;

  register(req: Request, res: Response): Promise<void>;
}

export type { IAuthController };

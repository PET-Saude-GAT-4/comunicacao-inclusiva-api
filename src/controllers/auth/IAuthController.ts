import type { Request, Response } from "express";

interface IAuthController {
  login(req: Request, res: Response): Promise<void>;
  checkToken(req: Request, res: Response): Promise<void>;
  requestPasswordReset(req: Request, res: Response): Promise<void>;
  confirmPasswordReset(req: Request, res: Response): Promise<void>;
}

export type { IAuthController };

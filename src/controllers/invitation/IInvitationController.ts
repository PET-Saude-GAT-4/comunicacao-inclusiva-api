import type { Request, Response } from "express";

interface IInvitationController {
  accept(req: Request, res: Response): Promise<void>;
  resend(req: Request, res: Response): Promise<void>;
}

export type { IInvitationController };

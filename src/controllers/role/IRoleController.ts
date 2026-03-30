import type { Request, Response } from "express";

interface IRoleController {
  create(req: Request, res: Response): Promise<void>;

  findById(req: Request, res: Response): Promise<void>;

  findAll(req: Request, res: Response): Promise<void>;

  update(req: Request, res: Response): Promise<void>;

  delete(req: Request, res: Response): Promise<void>;
}

export type { IRoleController };

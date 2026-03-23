import type { NextFunction, Request, Response } from "express";

interface IUserController {
  create(req: Request, res: Response, next: NextFunction): Promise<void>;

  findById(req: Request, res: Response, next: NextFunction): Promise<void>;

  findAll(req: Request, res: Response, next: NextFunction): Promise<void>;

  update(req: Request, res: Response, next: NextFunction): Promise<void>;

  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export type { IUserController };

import type { Request, Response } from "express";

interface Icontroller<T> {
  findById?(req: Request, res: Response): Promise<Response | void>;
  findAll(req: Request, res: Response): Promise<Response | void>;
  create(req: Request, res: Response): Promise<Response | void>;
  update?(req: Request, res: Response): Promise<Response | void>;
  delete(req: Request, res: Response): Promise<Response | void>;
}

export type { Icontroller };

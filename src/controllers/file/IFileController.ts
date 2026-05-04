import type { NextFunction, Request, Response } from "express";

interface IFileController {
  stream(req: Request, res: Response, next: NextFunction): Promise<unknown>;
}

export type { IFileController };

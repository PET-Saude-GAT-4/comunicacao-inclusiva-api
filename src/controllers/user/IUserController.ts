import type { Request, Response } from "express";

import type { IController } from "../IController.js";

interface IUserController extends IController {
  findByUuid(req: Request, res: Response): Promise<void>;
}

export type { IUserController };

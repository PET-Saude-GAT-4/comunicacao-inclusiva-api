import type { Request, Response } from "express";

import type { IController } from "../IController.js";

interface IProfessionController extends IController {
  findAllPublic(req: Request, res: Response): Promise<void>;
}

export type { IProfessionController };

import type { Request, Response } from "express";

import type { IController } from "../IController.js";

interface ISpecialityController extends IController {
  findAllByProfessionCode?(req: Request, res: Response): Promise<void>;
}

export type { ISpecialityController };

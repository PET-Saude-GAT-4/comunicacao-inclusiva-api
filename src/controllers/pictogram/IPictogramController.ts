import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";

interface IPictogramController extends IController {
  findAllPublic(req: Request, res: Response): Promise<void>;
}

export type { IPictogramController };

import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";
import type { PictogramOutput } from "@/models/types/Pictogram.type.js";

interface IPictogramController extends IController<PictogramOutput> {
  findAllPublic(req: Request, res: Response): Promise<void>;
}

export type { IPictogramController };

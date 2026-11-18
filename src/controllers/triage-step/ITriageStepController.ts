import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";

interface ITriageStepController extends IController {
  findByUuid(req: Request, res: Response): Promise<void>;

  findAllPublished(req: Request, res: Response): Promise<void>;
}

export type { ITriageStepController };

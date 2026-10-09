import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";
import type { TriageStepOutput } from "@/models/types/TriageStep.type.js";

interface ITriageStepController extends IController<TriageStepOutput> {
  findByUuid(req: Request, res: Response): Promise<void>;

  findAllPublished(req: Request, res: Response): Promise<void>;
}

export type { ITriageStepController };

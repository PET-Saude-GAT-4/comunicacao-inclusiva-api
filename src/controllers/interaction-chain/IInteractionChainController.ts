import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";

interface IInteractionChainController extends IController {
  findByUuid(req: Request, res: Response): Promise<void>;

  findByTriggerBoardUuid(req: Request, res: Response): Promise<void>;

  findByTriggerPhraseUuid(req: Request, res: Response): Promise<void>;
}

export type { IInteractionChainController };

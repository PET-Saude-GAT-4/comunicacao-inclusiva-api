import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";
import type { InteractionChainOutput } from "@/models/types/InteractionChain.type.js";

interface IInteractionChainController extends IController<InteractionChainOutput> {
  findByUuid(req: Request, res: Response): Promise<void>;

  findByTriggerBoardUuid(req: Request, res: Response): Promise<void>;
}

export type { IInteractionChainController };

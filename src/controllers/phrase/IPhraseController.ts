import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";

interface IPhraseController extends IController {
  findByUuid(req: Request, res: Response): Promise<void>;

  findAllPublished(req: Request, res: Response): Promise<void>;

  findPublishedByUuid(req: Request, res: Response): Promise<void>;

  findNextBoardsByPublishedPhrase(req: Request, res: Response): Promise<void>;

  publish(req: Request, res: Response): Promise<void>;

  unpublish(req: Request, res: Response): Promise<void>;
}

export type { IPhraseController };

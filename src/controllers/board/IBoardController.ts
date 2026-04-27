import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";
import type { BoardOutput } from "@/models/types/Board.type.js";

interface IBoardController extends IController<BoardOutput> {
  addPictogram(req: Request, res: Response): Promise<void>;

  findPictograms(req: Request, res: Response): Promise<void>;
}

export type { IBoardController };

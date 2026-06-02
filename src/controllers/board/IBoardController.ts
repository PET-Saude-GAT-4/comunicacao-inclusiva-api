import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";
import type { BoardOutput } from "@/models/types/Board.type.js";

interface IBoardController extends IController<BoardOutput> {
  findAllPublished(req: Request, res: Response): Promise<void>;

  publish(req: Request, res: Response): Promise<void>;

  unpublish(req: Request, res: Response): Promise<void>;

  addPictogram(req: Request, res: Response): Promise<void>;

  deleteBoardPictogram(req: Request, res: Response): Promise<void>;

  findPictograms(req: Request, res: Response): Promise<void>;

  reorderPictogram(req: Request, res: Response): Promise<void>;
}

export type { IBoardController };

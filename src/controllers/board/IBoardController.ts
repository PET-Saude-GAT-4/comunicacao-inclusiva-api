import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";
import type { BoardOutput } from "@/models/types/Board.type.js";

interface IBoardController extends IController<BoardOutput> {
  findByUuid(req: Request, res: Response): Promise<void>;

  findAllPublished(req: Request, res: Response): Promise<void>;

  findPublishedByUuid(req: Request, res: Response): Promise<void>;

  findTermsByPublishedBoard(req: Request, res: Response): Promise<void>;

  findNextBoardsByPublishedBoard(req: Request, res: Response): Promise<void>;

  publish(req: Request, res: Response): Promise<void>;

  unpublish(req: Request, res: Response): Promise<void>;

  addTerm(req: Request, res: Response): Promise<void>;

  deleteBoardTerm(req: Request, res: Response): Promise<void>;

  findTerms(req: Request, res: Response): Promise<void>;

  reorderTerm(req: Request, res: Response): Promise<void>;
}

export type { IBoardController };

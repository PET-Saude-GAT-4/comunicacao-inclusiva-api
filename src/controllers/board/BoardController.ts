import type { Request, Response } from "express";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { BoardOutput } from "@/models/types/Board.type.js";
import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import BoardService from "@/services/board/BoardService.js";
import type { IBoardService } from "@/services/board/IBoardService.js";
import { buildFileUrl } from "@/utils/file.js";

import type { IBoardController } from "./IBoardController.js";

type Props = {
  boardService?: IBoardService;
};

class BoardController implements IBoardController {
  private _boardService: IBoardService;

  constructor(props?: Props) {
    this._boardService = props?.boardService ?? new BoardService();
  }

  private _toResponse(board: BoardOutput) {
    return {
      uuid: board.uuid,
      title: board.title,
      representativePictogram: {
        uuid: board.representativePictogram.uuid,
        description: board.representativePictogram.description,
        fileUrl: buildFileUrl(board.representativePictogram.fileUuid),
        createdAt: board.representativePictogram.createdAt,
        updatedAt: board.representativePictogram.updatedAt,
      },
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }

  private _toPictogramResponse(pictogram: PictogramOutput) {
    return {
      uuid: pictogram.uuid,
      description: pictogram.description,
      fileUrl: buildFileUrl(pictogram.fileUuid),
      createdAt: pictogram.createdAt,
      updatedAt: pictogram.updatedAt,
    };
  }

  async create(req: Request, res: Response): Promise<void> {
    const { title, representativeUuid } = req.body;

    if (!title) {
      throw new BadRequestError("Title is required");
    }

    if (!representativeUuid) {
      throw new BadRequestError("Representative pictogram is required");
    }

    const board = await this._boardService.create({
      title,
      authorId: req.user?.id ?? null,
      representativeUuid,
    });

    res.status(201).json({ board: this._toResponse(board) });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const boards = await this._boardService.findAll();
    res.status(200).json({
      boards: boards.map((b) => this._toResponse(b)),
    });
  }

  async findById(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const board = await this._boardService.findByUuid(uuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    res.status(200).json({ board: this._toResponse(board) });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;
    const board = await this._boardService.findByUuid(uuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    await this._boardService.delete(board.id);
    res.status(204).send();
  }

  async addPictogram(req: Request, res: Response): Promise<void> {
    const boardUuid = req.params.uuid as string;
    const { pictogramUuid, order } = req.body;

    await this._boardService.addPictogram(boardUuid, {
      pictogramUuid,
      ...(order !== undefined ? { order: Number(order) } : {}),
    });

    res.status(204).send();
  }

  async findPictograms(req: Request, res: Response): Promise<void> {
    const boardUuid = req.params.uuid as string;

    const pictograms =
      await this._boardService.findPictogramsByBoardUuid(boardUuid);

    res.status(200).json({
      pictograms: pictograms.map((p) => this._toPictogramResponse(p)),
    });
  }
}

export default BoardController;

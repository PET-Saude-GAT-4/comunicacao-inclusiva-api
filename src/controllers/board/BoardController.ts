import type { Request, Response } from "express";

import { toPictogramResponse } from "@/controllers/pictogram/PictogramResponse.js";
import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { BoardOutput } from "@/models/types/Board.type.js";
import BoardService from "@/services/board/BoardService.js";
import type { IBoardService } from "@/services/board/IBoardService.js";

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
      authorUuid: board.authorUuid,
      representativePictogram: toPictogramResponse(
        board.representativePictogram,
      ),
      pictogramCount: board.pictogramCount,
      publishedAt: board.publishedAt,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
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

  async update(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;
    const { title, representativeUuid } = req.body;

    if (title === undefined && representativeUuid === undefined) {
      throw new BadRequestError("No fields to update");
    }

    const board = await this._boardService.update(
      uuid,
      {
        title,
        representativeUuid,
      },
      req.user!,
    );

    res.status(200).json({ board: this._toResponse(board) });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const boards = await this._boardService.findAll(req.user!);
    res.status(200).json({
      boards: boards.map((b) => this._toResponse(b)),
    });
  }

  async findAllPublished(req: Request, res: Response): Promise<void> {
    const boards = await this._boardService.findAllPublished();
    res.status(200).json({
      boards: boards.map((b) => this._toResponse(b)),
    });
  }

  async findPublishedByUuid(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const board = await this._boardService.findPublishedByUuid(uuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    res.status(200).json({ board: this._toResponse(board) });
  }

  async findPictogramsByPublishedBoard(
    req: Request,
    res: Response,
  ): Promise<void> {
    const uuid = req.params.uuid as string;

    const pictograms =
      await this._boardService.findPictogramsByPublishedBoardUuid(uuid);

    res.status(200).json({
      pictograms: pictograms.map((p, i) => ({
        ...toPictogramResponse(p),
        order: i + 1,
      })),
    });
  }

  async findNextBoardsByPublishedBoard(
    req: Request,
    res: Response,
  ): Promise<void> {
    const uuid = req.params.uuid as string;

    const boards =
      await this._boardService.findNextBoardsByPublishedBoardUuid(uuid);

    res.status(200).json({
      boards: boards.map((b, i) => ({
        ...this._toResponse(b),
        order: i + 1,
      })),
    });
  }

  async publish(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    await this._boardService.publish(uuid, req.user!);

    res.status(204).send();
  }

  async unpublish(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    await this._boardService.unpublish(uuid, req.user!);

    res.status(204).send();
  }

  async findByUuid(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const board = await this._boardService.findByUuid(uuid, req.user!);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    res.status(200).json({ board: this._toResponse(board) });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    await this._boardService.delete(uuid, req.user!);
    res.status(204).send();
  }

  async addPictogram(req: Request, res: Response): Promise<void> {
    const boardUuid = req.params.uuid as string;
    const { pictogramUuid, next } = req.body;

    if (!pictogramUuid) {
      throw new BadRequestError("Pictogram is required");
    }

    await this._boardService.addPictogram(
      boardUuid,
      {
        pictogramUuid,
        next,
      },
      req.user!,
    );

    res.status(204).send();
  }

  async deleteBoardPictogram(req: Request, res: Response): Promise<void> {
    const { uuid: boardUuid, pictogramUuid } = req.params as Record<
      string,
      string
    >;

    if (!boardUuid) {
      throw new BadRequestError("'boardUuid' is required");
    }

    if (!pictogramUuid) {
      throw new BadRequestError("'pictogramUuid' is required");
    }

    await this._boardService.deleteBoardPictogram(
      boardUuid,
      pictogramUuid,
      req.user!,
    );
    res.status(204).send();
  }

  async findPictograms(req: Request, res: Response): Promise<void> {
    const boardUuid = req.params.uuid as string;

    const pictograms = await this._boardService.findPictogramsByBoardUuid(
      boardUuid,
      req.user!,
    );

    res.status(200).json({
      pictograms: pictograms.map((p, i) => ({
        ...toPictogramResponse(p),
        order: i + 1,
      })),
    });
  }

  async reorderPictogram(req: Request, res: Response): Promise<void> {
    const boardUuid = req.params.uuid as string;
    const pictogramUuid = req.params.pictogramUuid as string;
    const { next } = req.body;

    await this._boardService.reorderPictogram(
      boardUuid,
      pictogramUuid,
      next ?? null,
      req.user!,
    );

    res.status(204).send();
  }
}

export default BoardController;

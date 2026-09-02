import type { Request, Response } from "express";

import { toPictogramResponse } from "@/controllers/pictogram/PictogramResponse.js";
import { toPlacementResponse } from "@/controllers/term/TermResponse.js";
import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { BoardOutput } from "@/models/types/Board.type.js";
import type { BoardTermOutput } from "@/models/types/BoardTerm.type.js";
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

  private _toBoardTermResponse(boardTerm: BoardTermOutput, index: number) {
    return {
      ...toPlacementResponse(boardTerm.uuid, boardTerm.term),
      order: index + 1,
    };
  }

  private _toResponse(board: BoardOutput) {
    return {
      uuid: board.uuid,
      title: board.title,
      authorUuid: board.authorUuid,
      representativePictogram: toPictogramResponse(
        board.representativePictogram,
      ),
      termCount: board.termCount,
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

  async findTermsByPublishedBoard(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const boardTerms =
      await this._boardService.findTermsByPublishedBoardUuid(uuid);

    res.status(200).json({
      terms: boardTerms.map((boardTerm, i) =>
        this._toBoardTermResponse(boardTerm, i),
      ),
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

  async addTerm(req: Request, res: Response): Promise<void> {
    const boardUuid = req.params.uuid as string;
    const { termUuid, next } = req.body;

    if (!termUuid) {
      throw new BadRequestError("Term is required");
    }

    await this._boardService.addTerm(
      boardUuid,
      {
        termUuid,
        next,
      },
      req.user!,
    );

    res.status(204).send();
  }

  async deleteBoardTerm(req: Request, res: Response): Promise<void> {
    const { uuid: boardUuid, boardTermUuid } = req.params as Record<
      string,
      string
    >;

    if (!boardUuid) {
      throw new BadRequestError("'boardUuid' is required");
    }

    if (!boardTermUuid) {
      throw new BadRequestError("'boardTermUuid' is required");
    }

    await this._boardService.deleteBoardTerm(
      boardUuid,
      boardTermUuid,
      req.user!,
    );
    res.status(204).send();
  }

  async findTerms(req: Request, res: Response): Promise<void> {
    const boardUuid = req.params.uuid as string;

    const boardTerms = await this._boardService.findTermsByBoardUuid(
      boardUuid,
      req.user!,
    );

    res.status(200).json({
      terms: boardTerms.map((boardTerm, i) =>
        this._toBoardTermResponse(boardTerm, i),
      ),
    });
  }

  async reorderTerm(req: Request, res: Response): Promise<void> {
    const boardUuid = req.params.uuid as string;
    const boardTermUuid = req.params.boardTermUuid as string;
    const { next } = req.body;

    await this._boardService.reorderTerm(
      boardUuid,
      boardTermUuid,
      next ?? null,
      req.user!,
    );

    res.status(204).send();
  }
}

export default BoardController;

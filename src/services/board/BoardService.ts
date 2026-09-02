import { BadRequestError } from "@/errors/BadRequestError.js";
import { ConflictError } from "@/errors/ConflictError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { BoardInput, BoardOutput } from "@/models/types/Board.type.js";
import type {
  BoardTermInput,
  BoardTermOutput,
} from "@/models/types/BoardTerm.type.js";
import { RoleEnum } from "@/models/types/Role.type.js";
import BoardRepository from "@/repositories/board/BoardRepository.js";
import type { IBoardRepository } from "@/repositories/board/IBoardRepository.js";
import type { IPictogramRepository } from "@/repositories/pictogram/IPictogramRepository.js";
import PictogramRepository from "@/repositories/pictogram/PictogramRepository.js";
import type { ITermRepository } from "@/repositories/term/ITermRepository.js";
import TermRepository from "@/repositories/term/TermRepository.js";
import type { AuthenticatedUser } from "@/types/user.js";

import type { IBoardService } from "./IBoardService.js";

type Props = {
  boardRepository?: IBoardRepository;
  pictogramRepository?: IPictogramRepository;
  termRepository?: ITermRepository;
};

class BoardService implements IBoardService {
  private _boardRepository: IBoardRepository;
  private _pictogramRepository: IPictogramRepository;
  private _termRepository: ITermRepository;

  constructor(props?: Props) {
    this._boardRepository = props?.boardRepository ?? new BoardRepository();
    // Still needed for Board.representative, which stays a plain Pictogram FK.
    this._pictogramRepository =
      props?.pictogramRepository ?? new PictogramRepository();
    this._termRepository = props?.termRepository ?? new TermRepository();
  }

  private _assertCanManage(board: BoardOutput, user: AuthenticatedUser): void {
    if (user.role === RoleEnum.SUPER_ADMIN) return;
    if (user.role === RoleEnum.ADMIN && board.authorUuid === user.uuid) return;
    throw new ForbiddenError("You are not allowed to manage this board.");
  }

  private _assertCanRead(board: BoardOutput, user: AuthenticatedUser): void {
    if (user.role === RoleEnum.SUPER_ADMIN) return;
    if (board.publishedAt !== null) return;
    if (user.role === RoleEnum.ADMIN && board.authorUuid === user.uuid) return;
    throw new ForbiddenError("You are not allowed to access this board.");
  }

  async create(data: BoardInput): Promise<BoardOutput> {
    const pictogram = await this._pictogramRepository.findByUuid(
      data.representativeUuid,
    );

    if (!pictogram) {
      throw new NotFoundError("Representative pictogram not found");
    }

    return this._boardRepository.create({
      title: data.title,
      authorId: data.authorId ?? null,
      representativeId: pictogram.id,
    });
  }

  async update(
    uuid: string,
    data: { title?: string; representativeUuid?: string },
    user: AuthenticatedUser,
  ): Promise<BoardOutput> {
    const board = await this._boardRepository.findByUuid(uuid);
    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanManage(board, user);

    let representativeId: number | undefined;
    if (data.representativeUuid) {
      const pictogram = await this._pictogramRepository.findByUuid(
        data.representativeUuid,
      );
      if (!pictogram) {
        throw new NotFoundError("Representative pictogram not found");
      }
      representativeId = pictogram.id;
    }

    return this._boardRepository.update(board.id, {
      title: data.title,
      representativeId,
    });
  }

  async findAll(user: AuthenticatedUser): Promise<BoardOutput[]> {
    return this._boardRepository.findAll(
      user.role === "admin" ? { authorUuid: user.uuid } : undefined,
    );
  }

  async findById(id: number): Promise<BoardOutput | null> {
    return this._boardRepository.findById(id);
  }

  async findByUuid(
    uuid: string,
    user?: AuthenticatedUser,
  ): Promise<BoardOutput | null> {
    const board = await this._boardRepository.findByUuid(uuid);

    if (board && user) {
      this._assertCanRead(board, user);
    }

    return board;
  }

  async findAllPublished(): Promise<BoardOutput[]> {
    return this._boardRepository.findAllPublished();
  }

  async findPublishedByUuid(uuid: string): Promise<BoardOutput | null> {
    const board = await this._boardRepository.findByUuid(uuid);

    if (!board || board.publishedAt === null) {
      return null;
    }

    return board;
  }

  async findTermsByPublishedBoardUuid(
    uuid: string,
  ): Promise<BoardTermOutput[]> {
    const board = await this._boardRepository.findByUuid(uuid);

    if (!board || board.publishedAt === null) {
      throw new NotFoundError("Board not found");
    }

    return this._boardRepository.findTermsByBoardId(board.id);
  }

  async findNextBoardsByPublishedBoardUuid(
    uuid: string,
  ): Promise<BoardOutput[]> {
    const board = await this._boardRepository.findByUuid(uuid);

    if (!board || board.publishedAt === null) {
      throw new NotFoundError("Board not found");
    }

    return this._boardRepository.findNextBoardsByBoardId(board.id);
  }

  async publish(uuid: string, user: AuthenticatedUser): Promise<BoardOutput> {
    const board = await this._boardRepository.findByUuid(uuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanManage(board, user);

    if (board.publishedAt !== null) {
      return board;
    }

    return this._boardRepository.setPublishedAt(board.id, new Date());
  }

  async unpublish(uuid: string, user: AuthenticatedUser): Promise<BoardOutput> {
    const board = await this._boardRepository.findByUuid(uuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanManage(board, user);

    if (board.publishedAt === null) {
      return board;
    }

    return this._boardRepository.setPublishedAt(board.id, null);
  }

  async delete(uuid: string, user: AuthenticatedUser): Promise<void> {
    const board = await this._boardRepository.findByUuid(uuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanManage(board, user);

    await this._boardRepository.delete(board.id);
  }

  // A BoardTerm uuid is already scoped to its board, so one lookup answers both
  // "does it exist" and "is it on this board".
  private async _resolveNextBoardTermId(
    boardId: number,
    next: string,
  ): Promise<number> {
    const nextBoardTerm = await this._boardRepository.findBoardTermByUuid(
      boardId,
      next,
    );

    if (!nextBoardTerm) {
      throw new BadRequestError("Next term is not associated with this board");
    }

    return nextBoardTerm.id;
  }

  async addTerm(
    boardUuid: string,
    data: BoardTermInput,
    user: AuthenticatedUser,
  ): Promise<void> {
    const board = await this._boardRepository.findByUuid(boardUuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanManage(board, user);

    const term = await this._termRepository.findByUuid(data.termUuid);

    if (!term) {
      throw new NotFoundError("Term not found");
    }

    const alreadyExists = await this._boardRepository.existsBoardTerm(
      board.id,
      term.id,
    );

    if (alreadyExists) {
      throw new ConflictError("This term is already in the board");
    }

    const nextBoardTermId =
      data.next != null
        ? await this._resolveNextBoardTermId(board.id, data.next)
        : null;

    await this._boardRepository.addTerm({
      boardId: board.id,
      termId: term.id,
      next: nextBoardTermId,
    });
  }

  async deleteBoardTerm(
    boardUuid: string,
    boardTermUuid: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    const board = await this._boardRepository.findByUuid(boardUuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanManage(board, user);

    const boardTerm = await this._boardRepository.findBoardTermByUuid(
      board.id,
      boardTermUuid,
    );

    if (!boardTerm) {
      throw new NotFoundError("Term is not associated with this board");
    }

    await this._boardRepository.deleteBoardTerm(board.id, boardTerm.id);
  }

  async findTermsByBoardUuid(
    boardUuid: string,
    user: AuthenticatedUser,
  ): Promise<BoardTermOutput[]> {
    const board = await this._boardRepository.findByUuid(boardUuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanRead(board, user);

    return this._boardRepository.findTermsByBoardId(board.id);
  }

  async reorderTerm(
    boardUuid: string,
    boardTermUuid: string,
    next: string | null,
    user: AuthenticatedUser,
  ): Promise<void> {
    const board = await this._boardRepository.findByUuid(boardUuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanManage(board, user);

    const boardTerm = await this._boardRepository.findBoardTermByUuid(
      board.id,
      boardTermUuid,
    );

    if (!boardTerm) {
      throw new NotFoundError("Term is not associated with this board");
    }

    let nextBoardTermId: number | null = null;
    if (next != null) {
      if (next === boardTermUuid) {
        throw new BadRequestError(
          "Next term must not be the same as the term being moved",
        );
      }
      nextBoardTermId = await this._resolveNextBoardTermId(board.id, next);
    }

    await this._boardRepository.reorderTerm(
      board.id,
      boardTerm.id,
      nextBoardTermId,
    );
  }
}

export default BoardService;

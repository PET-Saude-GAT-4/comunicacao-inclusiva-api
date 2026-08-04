import { BadRequestError } from "@/errors/BadRequestError.js";
import { ConflictError } from "@/errors/ConflictError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { BoardInput, BoardOutput } from "@/models/types/Board.type.js";
import type { BoardPictogramInput } from "@/models/types/BoardPictogram.type.js";
import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import BoardRepository from "@/repositories/board/BoardRepository.js";
import type { IBoardRepository } from "@/repositories/board/IBoardRepository.js";
import type { IPictogramRepository } from "@/repositories/pictogram/IPictogramRepository.js";
import PictogramRepository from "@/repositories/pictogram/PictogramRepository.js";
import type { AuthenticatedUser } from "@/types/user.js";

import type { IBoardService } from "./IBoardService.js";

type Props = {
  boardRepository?: IBoardRepository;
  pictogramRepository?: IPictogramRepository;
};

class BoardService implements IBoardService {
  private _boardRepository: IBoardRepository;
  private _pictogramRepository: IPictogramRepository;

  constructor(props?: Props) {
    this._boardRepository = props?.boardRepository ?? new BoardRepository();
    this._pictogramRepository =
      props?.pictogramRepository ?? new PictogramRepository();
  }

  private _assertCanManage(board: BoardOutput, user: AuthenticatedUser): void {
    if (user.role === "super_admin") return;
    if (user.role === "admin" && board.authorUuid === user.uuid) return;
    throw new ForbiddenError("You are not allowed to manage this board.");
  }

  private _assertCanRead(board: BoardOutput, user: AuthenticatedUser): void {
    if (user.role === "super_admin") return;
    if (board.publishedAt !== null) return;
    if (user.role === "admin" && board.authorUuid === user.uuid) return;
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

  async findPictogramsByPublishedBoardUuid(
    uuid: string,
  ): Promise<PictogramOutput[]> {
    const board = await this._boardRepository.findByUuid(uuid);

    if (!board || board.publishedAt === null) {
      throw new NotFoundError("Board not found");
    }

    return this._boardRepository.findPictogramsByBoardId(board.id);
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

  async addPictogram(
    boardUuid: string,
    data: BoardPictogramInput,
    user: AuthenticatedUser,
  ): Promise<void> {
    const board = await this._boardRepository.findByUuid(boardUuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanManage(board, user);

    const pictogram = await this._pictogramRepository.findByUuid(
      data.pictogramUuid,
    );

    if (!pictogram) {
      throw new NotFoundError("Pictogram not found");
    }

    const alreadyExists = await this._boardRepository.existsBoardPictogram(
      board.id,
      pictogram.id,
    );

    if (alreadyExists) {
      throw new ConflictError("This pictogram is already in the board");
    }

    let nextPictogramId: number | null = null;
    if (data.next != null) {
      const nextPictogram = await this._pictogramRepository.findByUuid(
        data.next,
      );
      if (!nextPictogram) {
        throw new BadRequestError("Next pictogram not found");
      }
      const nextInBoard = await this._boardRepository.existsBoardPictogram(
        board.id,
        nextPictogram.id,
      );
      if (!nextInBoard) {
        throw new BadRequestError(
          "Next pictogram is not associated with this board",
        );
      }
      nextPictogramId = nextPictogram.id;
    }

    await this._boardRepository.addPictogram({
      boardId: board.id,
      pictogramId: pictogram.id,
      next: nextPictogramId,
    });
  }

  async deleteBoardPictogram(
    boardUuid: string,
    pictogramUuid: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    const board = await this._boardRepository.findByUuid(boardUuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanManage(board, user);

    const pictogram = await this._pictogramRepository.findByUuid(pictogramUuid);

    if (!pictogram) {
      throw new NotFoundError("Pictogram not found");
    }

    await this._boardRepository.deleteBoardPictogram(board.id, pictogram.id);
  }

  async findPictogramsByBoardUuid(
    boardUuid: string,
    user: AuthenticatedUser,
  ): Promise<PictogramOutput[]> {
    const board = await this._boardRepository.findByUuid(boardUuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanRead(board, user);

    return this._boardRepository.findPictogramsByBoardId(board.id);
  }

  async reorderPictogram(
    boardUuid: string,
    pictogramUuid: string,
    next: string | null,
    user: AuthenticatedUser,
  ): Promise<void> {
    const board = await this._boardRepository.findByUuid(boardUuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    this._assertCanManage(board, user);

    const pictogram = await this._pictogramRepository.findByUuid(pictogramUuid);

    if (!pictogram) {
      throw new NotFoundError("Pictogram not found");
    }

    const pictogramInBoard = await this._boardRepository.existsBoardPictogram(
      board.id,
      pictogram.id,
    );

    if (!pictogramInBoard) {
      throw new NotFoundError("Pictogram is not associated with this board");
    }

    let nextPictogramId: number | null = null;
    if (next != null) {
      if (next === pictogramUuid) {
        throw new BadRequestError(
          "Next pictogram must not be the same as the pictogram being moved",
        );
      }
      const nextPictogram = await this._pictogramRepository.findByUuid(next);
      if (!nextPictogram) {
        throw new BadRequestError("Next pictogram not found");
      }
      const nextInBoard = await this._boardRepository.existsBoardPictogram(
        board.id,
        nextPictogram.id,
      );
      if (!nextInBoard) {
        throw new BadRequestError(
          "Next pictogram is not associated with this board",
        );
      }
      nextPictogramId = nextPictogram.id;
    }

    await this._boardRepository.reorderPictogram(
      board.id,
      pictogram.id,
      nextPictogramId,
    );
  }
}

export default BoardService;

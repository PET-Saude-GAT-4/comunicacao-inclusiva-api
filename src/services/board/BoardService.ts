import { ConflictError } from "@/errors/ConflictError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { BoardInput, BoardOutput } from "@/models/types/Board.type.js";
import type { BoardPictogramInput } from "@/models/types/BoardPictogram.type.js";
import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import BoardRepository from "@/repositories/board/BoardRepository.js";
import type { IBoardRepository } from "@/repositories/board/IBoardRepository.js";
import type { IPictogramRepository } from "@/repositories/pictogram/IPictogramRepository.js";
import PictogramRepository from "@/repositories/pictogram/PictogramRepository.js";

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

  async findAll(): Promise<BoardOutput[]> {
    return this._boardRepository.findAll();
  }

  async findById(id: number): Promise<BoardOutput | null> {
    return this._boardRepository.findById(id);
  }

  async findByUuid(uuid: string): Promise<BoardOutput | null> {
    return this._boardRepository.findByUuid(uuid);
  }

  async delete(id: number): Promise<void> {
    await this._boardRepository.delete(id);
  }

  async addPictogram(
    boardUuid: string,
    data: BoardPictogramInput,
  ): Promise<void> {
    const board = await this._boardRepository.findByUuid(boardUuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

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

    let order = data.order;
    if (order === undefined) {
      const maxOrder = await this._boardRepository.getMaxPictogramOrder(
        board.id,
      );
      order = maxOrder + 1;
    }

    await this._boardRepository.addPictogram({
      boardId: board.id,
      pictogramId: pictogram.id,
      order,
    });
  }

  async findPictogramsByBoardUuid(
    boardUuid: string,
  ): Promise<PictogramOutput[]> {
    const board = await this._boardRepository.findByUuid(boardUuid);

    if (!board) {
      throw new NotFoundError("Board not found");
    }

    return this._boardRepository.findPictogramsByBoardId(board.id);
  }
}

export default BoardService;

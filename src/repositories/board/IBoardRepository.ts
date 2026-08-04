import type {
  BoardOutput,
  BoardRepositoryInput,
} from "@/models/types/Board.type.js";
import type { BoardPictogramRepositoryInput } from "@/models/types/BoardPictogram.type.js";
import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import type { IRepository } from "@/repositories/IRepository.js";

interface IBoardRepository extends IRepository<BoardOutput> {
  findAll(filter?: { authorUuid?: string }): Promise<BoardOutput[]>;

  create(data: BoardRepositoryInput): Promise<BoardOutput>;

  update(
    id: number,
    data: { title: string | undefined; representativeId: number | undefined },
  ): Promise<BoardOutput>;

  findByUuid(uuid: string): Promise<BoardOutput | null>;

  findAllPublished(): Promise<BoardOutput[]>;

  setPublishedAt(id: number, value: Date | null): Promise<BoardOutput>;

  existsByUuid(uuid: string): Promise<boolean>;

  addPictogram(data: BoardPictogramRepositoryInput): Promise<void>;

  findPictogramsByBoardId(boardId: number): Promise<PictogramOutput[]>;

  findNextBoardsByBoardId(boardId: number): Promise<BoardOutput[]>;

  existsBoardPictogram(boardId: number, pictogramId: number): Promise<boolean>;

  deleteBoardPictogram(boardId: number, pictogramId: number): Promise<void>;

  reorderPictogram(
    boardId: number,
    pictogramId: number,
    next: number | null,
  ): Promise<void>;
}

export type { IBoardRepository };

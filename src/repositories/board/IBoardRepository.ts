import type {
  BoardOutput,
  BoardRepositoryInput,
} from "@/models/types/Board.type.js";
import type { BoardPictogramRepositoryInput } from "@/models/types/BoardPictogram.type.js";
import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import type { IRepository } from "@/repositories/IRepository.js";

interface IBoardRepository extends IRepository<BoardOutput> {
  create(data: BoardRepositoryInput): Promise<BoardOutput>;

  findByUuid(uuid: string): Promise<BoardOutput | null>;

  existsByUuid(uuid: string): Promise<boolean>;

  addPictogram(data: BoardPictogramRepositoryInput): Promise<void>;

  findPictogramsByBoardId(boardId: number): Promise<PictogramOutput[]>;

  existsBoardPictogram(boardId: number, pictogramId: number): Promise<boolean>;

  getMaxPictogramOrder(boardId: number): Promise<number>;
}

export type { IBoardRepository };

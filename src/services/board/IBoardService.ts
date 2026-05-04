import type { BoardInput, BoardOutput } from "@/models/types/Board.type.js";
import type { BoardPictogramInput } from "@/models/types/BoardPictogram.type.js";
import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import type { IService } from "@/services/IService.js";

interface IBoardService extends IService<BoardOutput> {
  create(data: BoardInput): Promise<BoardOutput>;

  findByUuid(uuid: string): Promise<BoardOutput | null>;

  addPictogram(boardUuid: string, data: BoardPictogramInput): Promise<void>;

  findPictogramsByBoardUuid(boardUuid: string): Promise<PictogramOutput[]>;
}

export type { IBoardService };

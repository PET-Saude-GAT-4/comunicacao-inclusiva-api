import type { BoardInput, BoardOutput } from "@/models/types/Board.type.js";
import type { BoardPictogramInput } from "@/models/types/BoardPictogram.type.js";
import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import type { IService } from "@/services/IService.js";

interface IBoardService extends IService<BoardOutput> {
  create(data: BoardInput): Promise<BoardOutput>;

  update(
    uuid: string,
    data: { title?: string; representativeUuid?: string },
  ): Promise<BoardOutput>;

  findByUuid(uuid: string): Promise<BoardOutput | null>;

  findAllPublished(): Promise<BoardOutput[]>;

  publish(uuid: string): Promise<BoardOutput>;

  unpublish(uuid: string): Promise<BoardOutput>;

  addPictogram(boardUuid: string, data: BoardPictogramInput): Promise<void>;

  deleteBoardPictogram(boardUuid: string, pictogramUuid: string): Promise<void>;

  findPictogramsByBoardUuid(boardUuid: string): Promise<PictogramOutput[]>;

  reorderPictogram(
    boardUuid: string,
    pictogramUuid: string,
    next: string | null,
  ): Promise<void>;
}

export type { IBoardService };

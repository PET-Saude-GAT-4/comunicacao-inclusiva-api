import type { BoardInput, BoardOutput } from "@/models/types/Board.type.js";
import type { BoardPictogramInput } from "@/models/types/BoardPictogram.type.js";
import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import type { AuthenticatedUser } from "@/types/user.js";

interface IBoardService {
  create(data: BoardInput): Promise<BoardOutput>;

  update(
    uuid: string,
    data: { title?: string; representativeUuid?: string },
    user: AuthenticatedUser,
  ): Promise<BoardOutput>;

  findAll(user: AuthenticatedUser): Promise<BoardOutput[]>;

  findById(id: number): Promise<BoardOutput | null>;

  findByUuid(
    uuid: string,
    user?: AuthenticatedUser,
  ): Promise<BoardOutput | null>;

  findAllPublished(): Promise<BoardOutput[]>;

  findPublishedByUuid(uuid: string): Promise<BoardOutput | null>;

  findPictogramsByPublishedBoardUuid(uuid: string): Promise<PictogramOutput[]>;

  publish(uuid: string, user: AuthenticatedUser): Promise<BoardOutput>;

  unpublish(uuid: string, user: AuthenticatedUser): Promise<BoardOutput>;

  delete(uuid: string, user: AuthenticatedUser): Promise<void>;

  addPictogram(
    boardUuid: string,
    data: BoardPictogramInput,
    user: AuthenticatedUser,
  ): Promise<void>;

  deleteBoardPictogram(
    boardUuid: string,
    pictogramUuid: string,
    user: AuthenticatedUser,
  ): Promise<void>;

  findPictogramsByBoardUuid(
    boardUuid: string,
    user: AuthenticatedUser,
  ): Promise<PictogramOutput[]>;

  reorderPictogram(
    boardUuid: string,
    pictogramUuid: string,
    next: string | null,
    user: AuthenticatedUser,
  ): Promise<void>;
}

export type { IBoardService };

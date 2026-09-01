import type { BoardInput, BoardOutput } from "@/models/types/Board.type.js";
import type {
  BoardItemInput,
  BoardItemOutput,
} from "@/models/types/BoardItem.type.js";
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

  findItemsByPublishedBoardUuid(uuid: string): Promise<BoardItemOutput[]>;

  findNextBoardsByPublishedBoardUuid(uuid: string): Promise<BoardOutput[]>;

  publish(uuid: string, user: AuthenticatedUser): Promise<BoardOutput>;

  unpublish(uuid: string, user: AuthenticatedUser): Promise<BoardOutput>;

  delete(uuid: string, user: AuthenticatedUser): Promise<void>;

  addItem(
    boardUuid: string,
    data: BoardItemInput,
    user: AuthenticatedUser,
  ): Promise<void>;

  deleteBoardItem(
    boardUuid: string,
    boardItemUuid: string,
    user: AuthenticatedUser,
  ): Promise<void>;

  findItemsByBoardUuid(
    boardUuid: string,
    user: AuthenticatedUser,
  ): Promise<BoardItemOutput[]>;

  reorderItem(
    boardUuid: string,
    boardItemUuid: string,
    next: string | null,
    user: AuthenticatedUser,
  ): Promise<void>;
}

export type { IBoardService };

import type { BoardInput, BoardOutput } from "@/models/types/Board.type.js";
import type {
  BoardTermInput,
  BoardTermOutput,
} from "@/models/types/BoardTerm.type.js";
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

  findTermsByPublishedBoardUuid(uuid: string): Promise<BoardTermOutput[]>;

  findNextBoardsByPublishedBoardUuid(uuid: string): Promise<BoardOutput[]>;

  publish(uuid: string, user: AuthenticatedUser): Promise<BoardOutput>;

  unpublish(uuid: string, user: AuthenticatedUser): Promise<BoardOutput>;

  delete(uuid: string, user: AuthenticatedUser): Promise<void>;

  addTerm(
    boardUuid: string,
    data: BoardTermInput,
    user: AuthenticatedUser,
  ): Promise<void>;

  deleteBoardTerm(
    boardUuid: string,
    boardTermUuid: string,
    user: AuthenticatedUser,
  ): Promise<void>;

  findTermsByBoardUuid(
    boardUuid: string,
    user: AuthenticatedUser,
  ): Promise<BoardTermOutput[]>;

  reorderTerm(
    boardUuid: string,
    boardTermUuid: string,
    next: string | null,
    user: AuthenticatedUser,
  ): Promise<void>;
}

export type { IBoardService };

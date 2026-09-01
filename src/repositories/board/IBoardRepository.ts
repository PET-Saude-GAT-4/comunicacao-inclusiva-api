import type {
  BoardOutput,
  BoardRepositoryInput,
} from "@/models/types/Board.type.js";
import type {
  BoardItemOutput,
  BoardItemRepositoryInput,
} from "@/models/types/BoardItem.type.js";
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

  addItem(data: BoardItemRepositoryInput): Promise<void>;

  findItemsByBoardId(boardId: number): Promise<BoardItemOutput[]>;

  findNextBoardsByBoardId(boardId: number): Promise<BoardOutput[]>;

  existsBoardItem(boardId: number, termId: number): Promise<boolean>;

  findItemByUuid(boardId: number, uuid: string): Promise<{ id: number } | null>;

  deleteBoardItem(boardId: number, boardItemId: number): Promise<void>;

  reorderItem(
    boardId: number,
    boardItemId: number,
    next: number | null,
  ): Promise<void>;
}

export type { IBoardRepository };

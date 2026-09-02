import type {
  BoardOutput,
  BoardRepositoryInput,
} from "@/models/types/Board.type.js";
import type {
  BoardTermOutput,
  BoardTermRepositoryInput,
} from "@/models/types/BoardTerm.type.js";
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

  addTerm(data: BoardTermRepositoryInput): Promise<void>;

  findTermsByBoardId(boardId: number): Promise<BoardTermOutput[]>;

  findNextBoardsByBoardId(boardId: number): Promise<BoardOutput[]>;

  existsBoardTerm(boardId: number, termId: number): Promise<boolean>;

  findBoardTermByUuid(
    boardId: number,
    uuid: string,
  ): Promise<{ id: number } | null>;

  deleteBoardTerm(boardId: number, boardTermId: number): Promise<void>;

  reorderTerm(
    boardId: number,
    boardTermId: number,
    next: number | null,
  ): Promise<void>;
}

export type { IBoardRepository };

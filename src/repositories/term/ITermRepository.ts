import type {
  TermOutput,
  TermRepositoryInput,
} from "@/models/types/Term.type.js";
import type { IRepository } from "@/repositories/IRepository.js";
import type { ListQuery, Page } from "@/utils/pagination.js";

interface ITermRepository extends IRepository<TermOutput> {
  create(data: TermRepositoryInput): Promise<TermOutput>;

  findPage(query: ListQuery): Promise<Page<TermOutput>>;

  findByUuid(uuid: string): Promise<TermOutput | null>;

  findManyByUuids(uuids: string[]): Promise<TermOutput[]>;

  existsPair(pictogramId: number, signWritingId: number): Promise<boolean>;

  isInUse(termId: number): Promise<boolean>;

  deleteByUuid(uuid: string): Promise<void>;
}

export type { ITermRepository };

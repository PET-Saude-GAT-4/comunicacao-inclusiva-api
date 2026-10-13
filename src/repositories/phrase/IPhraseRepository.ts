import type {
  PhraseOutput,
  PhraseRepositoryInput,
  PhraseRepositoryUpdateInput,
} from "@/models/types/Phrase.type.js";
import type { IRepository } from "@/repositories/IRepository.js";
import type { ListQuery, Page } from "@/utils/pagination.js";

interface IPhraseRepository extends IRepository<PhraseOutput> {
  create(data: PhraseRepositoryInput): Promise<PhraseOutput>;

  update(id: number, data: PhraseRepositoryUpdateInput): Promise<PhraseOutput>;

  findPage(
    query: ListQuery,
    filter?: { authorUuid?: string },
  ): Promise<Page<PhraseOutput>>;

  findByUuid(uuid: string): Promise<PhraseOutput | null>;

  findAllPublished(): Promise<PhraseOutput[]>;

  setPublishedAt(id: number, value: Date | null): Promise<PhraseOutput>;

  existsByUuid(uuid: string): Promise<boolean>;
}

export type { IPhraseRepository };

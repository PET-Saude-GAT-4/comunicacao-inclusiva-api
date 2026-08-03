import type {
  PhraseOutput,
  PhraseRepositoryInput,
  PhraseRepositoryUpdateInput,
} from "@/models/types/Phrase.type.js";
import type { IRepository } from "@/repositories/IRepository.js";

interface IPhraseRepository extends IRepository<PhraseOutput> {
  create(data: PhraseRepositoryInput): Promise<PhraseOutput>;

  update(id: number, data: PhraseRepositoryUpdateInput): Promise<PhraseOutput>;

  findAll(filter?: { authorUuid?: string }): Promise<PhraseOutput[]>;

  findByUuid(uuid: string): Promise<PhraseOutput | null>;

  findAllPublished(): Promise<PhraseOutput[]>;

  setPublishedAt(id: number, value: Date | null): Promise<PhraseOutput>;

  existsByUuid(uuid: string): Promise<boolean>;
}

export type { IPhraseRepository };

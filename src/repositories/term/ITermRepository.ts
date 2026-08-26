import type {
  TermOutput,
  TermRepositoryInput,
} from "@/models/types/Term.type.js";
import type { IRepository } from "@/repositories/IRepository.js";

interface ITermRepository extends IRepository<TermOutput> {
  create(data: TermRepositoryInput): Promise<TermOutput>;

  findByUuid(uuid: string): Promise<TermOutput | null>;

  existsPair(pictogramId: number, signWritingId: number): Promise<boolean>;

  deleteByUuid(uuid: string): Promise<void>;
}

export type { ITermRepository };

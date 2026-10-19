import type {
  SignWritingListOutput,
  SignWritingOutput,
  SignWritingRepositoryInput,
} from "@/models/types/SignWriting.type.js";
import type { IRepository } from "@/repositories/IRepository.js";
import type { ListQuery, Page } from "@/utils/pagination.js";

interface ISignWritingRepository extends IRepository<SignWritingOutput> {
  create(data: SignWritingRepositoryInput): Promise<SignWritingOutput>;

  findAll(): Promise<SignWritingOutput[]>;

  findPage(query: ListQuery): Promise<Page<SignWritingListOutput>>;

  findByUuid(uuid: string): Promise<SignWritingOutput | null>;

  findManyByUuids(uuids: string[]): Promise<SignWritingOutput[]>;

  deleteByUuid(uuid: string): Promise<void>;
}

export type { ISignWritingRepository };

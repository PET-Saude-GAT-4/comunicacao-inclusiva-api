import type {
  SignWritingOutput,
  SignWritingRepositoryInput,
} from "@/models/types/SignWriting.type.js";
import type { IRepository } from "@/repositories/IRepository.js";

interface ISignWritingRepository extends IRepository<SignWritingOutput> {
  create(data: SignWritingRepositoryInput): Promise<SignWritingOutput>;

  findByUuid(uuid: string): Promise<SignWritingOutput | null>;

  findManyByUuids(uuids: string[]): Promise<SignWritingOutput[]>;

  deleteByUuid(uuid: string): Promise<void>;
}

export type { ISignWritingRepository };

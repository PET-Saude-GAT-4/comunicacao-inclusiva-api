import type {
  SignWritingInput,
  SignWritingOutput,
} from "@/models/types/SignWriting.type.js";
import type { IService } from "@/services/IService.js";

interface ISignWritingService extends IService<SignWritingOutput> {
  create(data: SignWritingInput): Promise<SignWritingOutput>;

  findByUuid(uuid: string): Promise<SignWritingOutput | null>;

  delete(id: number): Promise<void>;
  deleteByUuid(uuid: string): Promise<void>;
}

export type { ISignWritingService };

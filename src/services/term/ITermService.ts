import type { TermInput, TermOutput } from "@/models/types/Term.type.js";
import type { IService } from "@/services/IService.js";

interface ITermService extends IService<TermOutput> {
  create(data: TermInput): Promise<TermOutput>;

  findByUuid(uuid: string): Promise<TermOutput | null>;

  delete(id: number): Promise<void>;
  deleteByUuid(uuid: string): Promise<void>;
}

export type { ITermService };

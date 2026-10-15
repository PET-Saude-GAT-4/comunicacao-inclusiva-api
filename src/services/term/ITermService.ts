import type { TermInput, TermOutput } from "@/models/types/Term.type.js";
import type { IService } from "@/services/IService.js";
import type { ListQuery, Page } from "@/utils/pagination.js";

interface ITermService extends IService<TermOutput> {
  create(data: TermInput): Promise<TermOutput>;

  findPage(query: ListQuery): Promise<Page<TermOutput>>;

  findByUuid(uuid: string): Promise<TermOutput | null>;

  delete(id: number): Promise<void>;
  deleteByUuid(uuid: string): Promise<void>;
}

export type { ITermService };

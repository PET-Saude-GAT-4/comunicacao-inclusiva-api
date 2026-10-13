import type {
  PictogramInput,
  PictogramOutput,
} from "@/models/types/Pictogram.type.js";
import type { IService } from "@/services/IService.js";
import type { ListQuery, Page } from "@/utils/pagination.js";

interface IPictogramService extends IService<PictogramOutput> {
  create(data: PictogramInput): Promise<PictogramOutput>;

  findPage(query: ListQuery): Promise<Page<PictogramOutput>>;

  findByUuid(uuid: string): Promise<PictogramOutput | null>;

  delete(id: number): Promise<void>;
  deleteByUuid(uuid: string): Promise<void>;
}

export type { IPictogramService };

import type {
  PictogramInput,
  PictogramOutput,
} from "@/models/types/Pictogram.type.js";
import type { IService } from "@/services/IService.js";

interface IPictogramService extends IService<PictogramOutput> {
  create(data: PictogramInput): Promise<PictogramOutput>;

  findByUuid(uuid: string): Promise<PictogramOutput | null>;

  deleteByUuid(uuid: string): Promise<void>;
}

export type { IPictogramService };

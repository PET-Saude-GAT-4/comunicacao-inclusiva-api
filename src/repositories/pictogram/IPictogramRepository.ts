import type {
  PictogramOutput,
  PictogramRepositoryInput,
} from "@/models/types/Pictogram.type.js";
import type { IRepository } from "@/repositories/IRepository.js";

interface IPictogramRepository extends IRepository<PictogramOutput> {
  create(data: PictogramRepositoryInput): Promise<PictogramOutput>;

  findByUuid(uuid: string): Promise<PictogramOutput | null>;

  deleteByUuid(uuid: string): Promise<void>;
}

export type { IPictogramRepository };

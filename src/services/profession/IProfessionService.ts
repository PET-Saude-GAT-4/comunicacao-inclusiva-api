import type {
  ProfessionInput,
  ProfessionOutput,
  ProfessionUpdate,
} from "@/models/types/Profession.type.js";

import type { IService } from "../IService.js";

interface IProfessionService extends IService<ProfessionOutput> {
  create(data: ProfessionInput): Promise<ProfessionOutput>;
  update(id: number, data: ProfessionUpdate): Promise<ProfessionOutput>;
}

export type { IProfessionService };

import type { Profession } from "@/models/Profession.js";
import type {
  ProfessionInput,
  ProfessionOutput,
  ProfessionUpdate,
} from "@/models/types/Profession.type.js";

import type { IRepository } from "../IRepository.js";

interface IProfessionRepository extends IRepository<ProfessionOutput> {
  findByName(name: string): Promise<ProfessionOutput | null>;
  findByCode(code: string): Promise<ProfessionOutput | null>;

  create(data: ProfessionInput): Promise<ProfessionOutput>;
  update(id: number, data: ProfessionUpdate): Promise<ProfessionOutput>;
}

export type { IProfessionRepository };

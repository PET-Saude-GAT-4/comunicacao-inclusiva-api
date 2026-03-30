import type {
  SpecialtyInput,
  SpecialtyOutput,
  SpecialtyUpdate,
} from "@/models/types/Specialty.type.js";

import type { IService } from "../IService.js";

interface ISpecialityService extends IService<SpecialtyOutput> {
  create(data: SpecialtyInput): Promise<SpecialtyOutput>;
  update(id: number, data: SpecialtyUpdate): Promise<SpecialtyOutput>;
}

export type { ISpecialityService };

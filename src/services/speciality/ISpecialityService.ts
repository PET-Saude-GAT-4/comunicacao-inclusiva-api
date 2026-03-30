import type {
  SpecialityInput,
  SpecialityOutput,
  SpecialityUpdate,
} from "@/models/types/Speciality.type.js";

import type { IService } from "../IService.js";

interface ISpecialityService extends IService<SpecialityOutput> {
  create(data: SpecialityInput): Promise<SpecialityOutput>;
  update(id: number, data: SpecialityUpdate): Promise<SpecialityOutput>;
}

export type { ISpecialityService };

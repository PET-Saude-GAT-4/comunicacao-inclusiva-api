import type {
  SpecialtyInput,
  SpecialtyOutput,
  SpecialtyUpdate,
} from "@/models/types/Specialty.type.js";

import type { IRepository } from "../IRepository.js";

interface ISpecialityRepository extends IRepository<SpecialtyOutput> {
  findByCode(code: string): Promise<SpecialtyOutput | null>;
  findByNameAndProfessionId(
    name: string,
    professionId: number,
  ): Promise<SpecialtyOutput | null>;

  create(data: SpecialtyInput): Promise<SpecialtyOutput>;
  update(id: number, data: SpecialtyUpdate): Promise<SpecialtyOutput>;
}

export type { ISpecialityRepository };

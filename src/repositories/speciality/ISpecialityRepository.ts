import type {
  SpecialityOutput,
  SpecialityRepositoryInput,
  SpecialityUpdate,
} from "@/models/types/Speciality.type.js";

import type { IRepository } from "../IRepository.js";

interface ISpecialityRepository extends IRepository<SpecialityOutput> {
  findByCode(code: string): Promise<SpecialityOutput | null>;
  findByNameAndProfessionId(
    name: string,
    professionId: number,
  ): Promise<SpecialityOutput | null>;
  findAllByProfessionId(professionId: number): Promise<SpecialityOutput[]>;

  create(data: SpecialityRepositoryInput): Promise<SpecialityOutput>;
  update(id: number, data: SpecialityUpdate): Promise<SpecialityOutput>;
}

export type { ISpecialityRepository };

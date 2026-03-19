import type { Specialty } from "@/models/Specialty.js";
import type { IRepository } from "../IRepository.js";

interface ISpecialityRepository extends IRepository<Specialty> {
  findByCode(code: string): Promise<Specialty | null>;
  findByNameAndProfessionId(name: string, professionId: number): Promise<Specialty | null>;
}

export type { ISpecialityRepository };

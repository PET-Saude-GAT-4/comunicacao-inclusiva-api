import type { Profession } from "@/models/Profession.js";
import type { IRepository } from "../IRepository.js";

interface IProfessionRepository extends IRepository<Profession> {
  findByName(name: string): Promise<Profession | null>;
  findByCode(code: string): Promise<Profession | null>;
}

export type { IProfessionRepository };

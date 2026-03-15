import type { Specialty } from "@/models/Specialty.js";
import type { IRepository } from "../IRepository.js";

interface ISpecialityRepository extends IRepository<Specialty> {}

export type { ISpecialityRepository };

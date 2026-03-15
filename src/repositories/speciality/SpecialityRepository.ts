import type { Specialty } from "@/models/Specialty.js";
import type { ISpecialityRepository } from "./ISpecialityRepository.js";

class SpecialityRepository implements ISpecialityRepository {
  async create(value: Partial<Specialty>): Promise<Specialty> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<Specialty[]> {
    throw new Error("Method not implemented.");
  }
}

export default SpecialityRepository;

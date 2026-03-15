import type { ISpecialityRepository } from "./ISpecialityRepository.js";

class SpecialityRepository implements ISpecialityRepository {
  async create(value: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

export default SpecialityRepository;

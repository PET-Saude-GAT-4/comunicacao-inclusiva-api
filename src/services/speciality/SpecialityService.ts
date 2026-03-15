import type { ISpecialityRepository } from "@/repositories/speciality/ISpecialityRepository.js";
import SpecialityRepository from "@/repositories/speciality/SpecialityRepository.js";

import type { ISpecialityService } from "./ISpecialityService.js";

import type { Specialty } from "@/models/Specialty.js";

type Props = {
  specialityRepository?: ISpecialityRepository;
};

class SpecialityService implements ISpecialityService {
  private _specialityRepository: ISpecialityRepository;

  constructor(props?: Props) {
    this._specialityRepository =
      props?.specialityRepository ?? new SpecialityRepository();
  }

  async create(value: Partial<Specialty>): Promise<Specialty> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<Specialty[]> {
    throw new Error("Method not implemented.");
  }
}

export default SpecialityService;

import type { ISpecialityRepository } from "@/repositories/speciality/ISpecialityRepository.js";
import SpecialityRepository from "@/repositories/speciality/SpecialityRepository.js";

import type { ISpecialityService } from "./ISpecialityService.js";

type Props = {
  specialityRepository?: ISpecialityRepository;
};

class SpecialityService implements ISpecialityService {
  private _specialityRepository: ISpecialityRepository;

  constructor(props?: Props) {
    this._specialityRepository =
      props?.specialityRepository ?? new SpecialityRepository();
  }

  async create(value: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

export default SpecialityService;

import type { ISpecialityService } from "@/services/speciality/ISpecialityService.js";
import SpecialityService from "@/services/speciality/SpecialityService.js";

import type { ISpecialityController } from "./ISpecialityController.js";

type Props = {
  specialityService?: ISpecialityService;
};

class SpecialityController implements ISpecialityController {
  private _specialityService: ISpecialityService;

  constructor(props?: Props) {
    this._specialityService =
      props?.specialityService ?? new SpecialityService();
  }
}

export default SpecialityController;

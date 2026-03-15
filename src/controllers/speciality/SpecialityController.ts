import type { ISpecialityService } from "@/services/speciality/ISpecialityService.js";
import SpecialityService from "@/services/speciality/SpecialityService.js";

import type { ISpecialityController } from "./ISpecialityController.js";

import type { Request, Response } from 'express';

type Props = {
  specialityService?: ISpecialityService;
};

class SpecialityController implements ISpecialityController {
  private _specialityService: ISpecialityService;

  constructor(props?: Props) {
    this._specialityService =
      props?.specialityService ?? new SpecialityService();
  }

  async create(request: Request, response: Response): Promise<Response | void> {
    throw new Error("Method not implemented.");
  }

  async findAll(request: Request, response: Response): Promise<Response | void> {
    throw new Error("Method not implemented.");
  }
}

export default SpecialityController;

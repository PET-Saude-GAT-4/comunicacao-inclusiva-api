import type { Request, Response } from "express";

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

  async create(req: Request, res: Response): Promise<Response | void> {
    const { professionId } = req.params;
    const { name, code } = req.body;

    const specialty = await this._specialityService.create({
      name,
      code,
      professionId: Number(professionId),
    });

    return res.status(201).json(specialty);
  }

  async update(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;

    const specialty = await this._specialityService.update!(
      Number(id),
      req.body,
    );

    return res.status(200).json(specialty);
  }

  async findAll(req: Request, res: Response): Promise<Response | void> {
    const specialties = await this._specialityService.findAll();
    return res.status(200).json(specialties);
  }

  async findById(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;

    const specialty = await this._specialityService.findById!(Number(id));

    return res.status(200).json(specialty);
  }

  async delete(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;
    await this._specialityService.delete(Number(id));

    return res.status(204).send();
  }
}

export default SpecialityController;

import type { Request, Response } from "express";

import { NotFoundError } from "@/errors/NotFoundError.js";
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

  async create(req: Request, res: Response): Promise<void> {
    const { professionId } = req.params;
    const { name, code } = req.body;

    const speciality = await this._specialityService.create({
      name,
      code,
      professionId: Number(professionId),
    });

    res.status(201).json({ speciality });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const speciality = await this._specialityService.update!(
      Number(id),
      req.body,
    );

    res.status(200).json({ speciality });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const specialities = await this._specialityService.findAll();
    res.status(200).json({ specialities: specialities });
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const speciality = await this._specialityService.findById!(Number(id));

    if (!speciality) {
      throw new NotFoundError("Speciality not found");
    }

    res.status(200).json({ speciality: speciality });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this._specialityService.delete(Number(id));

    res.status(204).send();
  }
}

export default SpecialityController;

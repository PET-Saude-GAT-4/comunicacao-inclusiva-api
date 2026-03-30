import type { Request, Response } from "express";

import type { ProfessionOutput } from "@/models/types/Profession.type.js";
import type { IProfessionService } from "@/services/profession/IProfessionService.js";
import ProfessionService from "@/services/profession/ProfessionService.js";

import type { IProfessionController } from "./IProfessionController.js";

type Props = {
  professionService?: IProfessionService;
};

class ProfessionController implements IProfessionController {
  private _professionService: IProfessionService;

  constructor(props?: Props) {
    this._professionService =
      props?.professionService ?? new ProfessionService();
  }

  async create(req: Request, res: Response): Promise<Response | void> {
    const profession: ProfessionOutput = await this._professionService.create(
      req.body,
    );

    return res.status(201).json(profession);
  }

  async update(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;

    const profession = await this._professionService.update!(
      Number(id),
      req.body,
    );

    return res.status(200).json(profession);
  }

  async findAll(req: Request, res: Response): Promise<Response | void> {
    const professions = await this._professionService.findAll!();
    return res.status(200).json(professions);
  }

  async findById(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;

    const profession = await this._professionService.findById!(Number(id));

    return res.status(200).json(profession);
  }

  async delete(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;
    await this._professionService.delete(Number(id));

    return res.status(204).send();
  }
}

export default ProfessionController;

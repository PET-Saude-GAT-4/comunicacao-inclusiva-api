import type { IProfessionService } from "@/services/profession/IProfessionService.js";
import ProfessionService from "@/services/profession/ProfessionService.js";

import type { IProfessionController } from "./IProfessionController.js";
import type { Request, Response } from 'express';
import { Profession } from "@/models/Profession.js";

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
    const profession: Profession = await this._professionService.create(req.body);

    return res.status(201).json(profession);
  }

  async findAll(request: Request, response: Response): Promise<Response | void> {
    const professions: Profession[] = await this._professionService.findAll!();
    return response.status(200).json(professions);
  }

  async delete(request: Request, response: Response): Promise<Response | void> {
    const { id } = request.params;
    await this._professionService.delete(Number(id));

    return response.status(204).send();
  }
}

export default ProfessionController;

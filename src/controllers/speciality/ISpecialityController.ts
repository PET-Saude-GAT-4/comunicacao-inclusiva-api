import type { Request, Response } from "express";

import type { SpecialityOutput } from "@/models/types/Speciality.type.js";

import type { IController } from "../IController.js";

interface ISpecialityController extends IController<SpecialityOutput> {
  findAllByProfessionCode?(req: Request, res: Response): Promise<void>;
}

export type { ISpecialityController };

import type { Request, Response } from "express";

import type { ProfessionOutput } from "@/models/types/Profession.type.js";

import type { IController } from "../IController.js";

interface IProfessionController extends IController<ProfessionOutput> {
  findAllPublic(req: Request, res: Response): Promise<void>;
}

export type { IProfessionController };

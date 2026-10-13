import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";
import type { SignWritingOutput } from "@/models/types/SignWriting.type.js";

interface ISignWritingController extends IController<SignWritingOutput> {
  findAllPublic(req: Request, res: Response): Promise<void>;
}

export type { ISignWritingController };

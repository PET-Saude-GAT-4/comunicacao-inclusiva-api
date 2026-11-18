import type { Request, Response } from "express";

import type { IController } from "@/controllers/IController.js";

interface ISignWritingController extends IController {
  findAllPublic(req: Request, res: Response): Promise<void>;
}

export type { ISignWritingController };

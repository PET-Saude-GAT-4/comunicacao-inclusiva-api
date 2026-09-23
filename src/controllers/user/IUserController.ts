import type { Request, Response } from "express";

import type { UserOutput } from "@/models/types/User.type.js";

import type { IController } from "../IController.js";

interface IUserController extends IController<UserOutput> {
  findByUuid(req: Request, res: Response): Promise<void>;
}

export type { IUserController };

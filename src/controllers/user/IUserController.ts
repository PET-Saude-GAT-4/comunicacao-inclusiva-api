import type { UserOutput } from "@/models/types/User.type.js";

import type { IController } from "../IController.js";

interface IUserController extends IController<UserOutput> {}

export type { IUserController };

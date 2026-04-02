import type { RoleOutput } from "@/models/types/Role.type.js";

import type { IController } from "../IController.js";

interface IRoleController extends IController<RoleOutput> {}

export type { IRoleController };

import type { ProfessionOutput } from "@/models/types/Profession.type.js";

import type { IController } from "../IController.js";

interface IProfessionController extends IController<ProfessionOutput> {}

export type { IProfessionController };

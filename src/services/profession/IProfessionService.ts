import type { Profession } from "@/models/Profession.js";

import type { IService } from "../Iservice.js";

interface IProfessionService extends IService<Profession> {}

export type { IProfessionService };

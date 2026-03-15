import type { Specialty } from "@/models/Specialty.js";
import type { IService } from "../Iservice.js";

interface ISpecialityService extends IService<Specialty> {}

export type { ISpecialityService };

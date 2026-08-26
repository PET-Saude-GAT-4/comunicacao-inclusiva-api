import type { IController } from "@/controllers/IController.js";
import type { TermOutput } from "@/models/types/Term.type.js";

interface ITermController extends IController<TermOutput> {}

export type { ITermController };

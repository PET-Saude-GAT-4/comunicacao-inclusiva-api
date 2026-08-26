import type { IController } from "@/controllers/IController.js";
import type { SignWritingOutput } from "@/models/types/SignWriting.type.js";

interface ISignWritingController extends IController<SignWritingOutput> {}

export type { ISignWritingController };

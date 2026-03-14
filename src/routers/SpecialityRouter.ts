import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import type { ISpecialityController } from "@/controllers/speciality/ISpecialityController.js";
import SpecialityController from "@/controllers/speciality/SpecialityController.js";

const specialityController: ISpecialityController = new SpecialityController();

const router = express.Router();

// Example:
// router.post("/", (req: Request, res: Response, next: NextFunction) => specialityController.create(req, res, next));

export default router;

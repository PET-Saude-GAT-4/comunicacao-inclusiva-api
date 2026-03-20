import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import type { ISpecialityController } from "@/controllers/speciality/ISpecialityController.js";
import SpecialityController from "@/controllers/speciality/SpecialityController.js";

const specialityController: ISpecialityController = new SpecialityController();

const router = express.Router();

router.get("/findAll", specialityController.findAll.bind(specialityController));
router.get("/:id", specialityController.findById!.bind(specialityController));
router.patch("/:id", specialityController.update!.bind(specialityController));
router.delete("/:id", specialityController.delete.bind(specialityController));

export default router;

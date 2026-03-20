import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import type { IProfessionController } from "@/controllers/profession/IProfessionController.js";
import ProfessionController from "@/controllers/profession/ProfessionController.js";
import type { ISpecialityController } from "@/controllers/speciality/ISpecialityController.js";
import SpecialityController from "@/controllers/speciality/SpecialityController.js";

const professionController: IProfessionController = new ProfessionController();

const specialityController: ISpecialityController = new SpecialityController();

const router = express.Router();

router.post("/", professionController.create.bind(professionController));
router.get("/findAll", professionController.findAll.bind(professionController));
router.get("/:id", professionController.findById!.bind(professionController));
router.patch("/:id", professionController.update!.bind(professionController));
router.delete("/:id", professionController.delete.bind(professionController));

//Rota aninhada para criar specialties
router.post(
  "/:professionId/specialties",
  specialityController.create.bind(specialityController),
);

export default router;

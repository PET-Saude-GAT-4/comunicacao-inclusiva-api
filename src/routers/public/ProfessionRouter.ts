import express from "express";

import type { IProfessionController } from "@/controllers/profession/IProfessionController.js";
import ProfessionController from "@/controllers/profession/ProfessionController.js";
import SpecialityController from "@/controllers/speciality/SpecialityController.js";
import type { ISpecialityController } from "@/controllers/speciality/ISpecialityController.js";

const professionController: IProfessionController = new ProfessionController();
const specialityController: ISpecialityController = new SpecialityController();

const router = express.Router();

router.get("/", professionController.findAll.bind(professionController));

router.get(
  "/:professionCode/specialities",
  specialityController.findAllByProfessionCode!.bind(specialityController),
);

export default router;

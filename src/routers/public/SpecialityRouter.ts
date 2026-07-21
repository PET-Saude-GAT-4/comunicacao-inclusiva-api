import express from "express";

import type { ISpecialityController } from "@/controllers/speciality/ISpecialityController.js";
import SpecialityController from "@/controllers/speciality/SpecialityController.js";

const specialityController: ISpecialityController = new SpecialityController();

const router = express.Router();

router.get(
  "/:code",
  specialityController.findAllByProfessionCode!.bind(specialityController),
);

export default router;

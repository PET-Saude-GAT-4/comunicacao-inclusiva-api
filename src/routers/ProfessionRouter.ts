import express from "express";

import type { IProfessionController } from "@/controllers/profession/IProfessionController.js";
import ProfessionController from "@/controllers/profession/ProfessionController.js";
import type { ISpecialityController } from "@/controllers/speciality/ISpecialityController.js";
import SpecialityController from "@/controllers/speciality/SpecialityController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();

const professionController: IProfessionController = new ProfessionController();

const specialityController: ISpecialityController = new SpecialityController();

const router = express.Router();

router.post(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  professionController.create.bind(professionController),
);

router.get(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  professionController.findAll.bind(professionController),
);

router.get(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  professionController.findById!.bind(professionController),
);

router.patch(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  professionController.update!.bind(professionController),
);

router.delete(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  professionController.delete.bind(professionController),
);

//Rota aninhada para criar specialities
router.post(
  "/:professionId/specialities",
  authMiddleware.auth(["super_admin", "admin"]),
  specialityController.create.bind(specialityController),
);

export default router;

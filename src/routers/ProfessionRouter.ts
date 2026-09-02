import express from "express";

import type { IProfessionController } from "@/controllers/profession/IProfessionController.js";
import ProfessionController from "@/controllers/profession/ProfessionController.js";
import type { ISpecialityController } from "@/controllers/speciality/ISpecialityController.js";
import SpecialityController from "@/controllers/speciality/SpecialityController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";
import { RoleEnum } from "@/models/types/Role.type.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();

const professionController: IProfessionController = new ProfessionController();

const specialityController: ISpecialityController = new SpecialityController();

const router = express.Router();

router.post(
  "/",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  professionController.create.bind(professionController),
);

router.get(
  "/",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  professionController.findAll.bind(professionController),
);

router.get(
  "/:id",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  professionController.findById!.bind(professionController),
);

router.patch(
  "/:id",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  professionController.update!.bind(professionController),
);

router.delete(
  "/:id",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  professionController.delete.bind(professionController),
);

//Rota aninhada para criar specialities
router.post(
  "/:professionCode/specialities",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  specialityController.create.bind(specialityController),
);

export default router;

import express from "express";

import type { ISpecialityController } from "@/controllers/speciality/ISpecialityController.js";
import SpecialityController from "@/controllers/speciality/SpecialityController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";
import { RoleEnum } from "@/models/types/Role.type.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();

const specialityController: ISpecialityController = new SpecialityController();

const router = express.Router();

router.get(
  "/",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  specialityController.findAll.bind(specialityController),
);

router.get(
  "/:id",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  specialityController.findById!.bind(specialityController),
);

router.patch(
  "/:id",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  specialityController.update!.bind(specialityController),
);

router.delete(
  "/:id",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  specialityController.delete.bind(specialityController),
);

export default router;

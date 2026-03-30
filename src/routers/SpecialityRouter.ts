import express from "express";

import type { ISpecialityController } from "@/controllers/speciality/ISpecialityController.js";
import SpecialityController from "@/controllers/speciality/SpecialityController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();

const specialityController: ISpecialityController = new SpecialityController();

const router = express.Router();

router.get(
  "/findAll",
  authMiddleware.auth(["super_admin", "admin"]),
  specialityController.findAll.bind(specialityController),
);

router.get(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  specialityController.findById!.bind(specialityController),
);

router.patch(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  specialityController.update!.bind(specialityController),
);

router.delete(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  specialityController.delete.bind(specialityController),
);

export default router;

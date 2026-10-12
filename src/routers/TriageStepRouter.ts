import express, { type Request, type Response } from "express";

import type { ITriageStepController } from "@/controllers/triage-step/ITriageStepController.js";
import TriageStepController from "@/controllers/triage-step/TriageStepController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";
import { RoleEnum } from "@/models/types/Role.type.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();
const triageStepController: ITriageStepController = new TriageStepController();

const router = express.Router();

router.get(
  "/",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  triageStepController.findAll.bind(triageStepController),
);

router.post(
  "/",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN]),
  triageStepController.create.bind(triageStepController),
);

router.get(
  "/:uuid",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  triageStepController.findByUuid.bind(triageStepController),
);

router.patch(
  "/:uuid",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN]),
  (req: Request, res: Response) => triageStepController.update!(req, res),
);

router.delete(
  "/:uuid",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN]),
  triageStepController.delete.bind(triageStepController),
);

export default router;

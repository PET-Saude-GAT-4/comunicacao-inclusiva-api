import express, { type Request, type Response } from "express";

import type { IPhraseController } from "@/controllers/phrase/IPhraseController.js";
import PhraseController from "@/controllers/phrase/PhraseController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";
import { RoleEnum } from "@/models/types/Role.type.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();
const phraseController: IPhraseController = new PhraseController();

const router = express.Router();

router.get(
  "/",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  phraseController.findAll.bind(phraseController),
);

router.post(
  "/",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  phraseController.create.bind(phraseController),
);

router.get(
  "/:uuid",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  phraseController.findByUuid.bind(phraseController),
);

router.patch(
  "/:uuid",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  (req: Request, res: Response) => phraseController.update!(req, res),
);

router.patch(
  "/:uuid/publish",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  phraseController.publish.bind(phraseController),
);

router.patch(
  "/:uuid/unpublish",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  phraseController.unpublish.bind(phraseController),
);

router.delete(
  "/:uuid",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  phraseController.delete.bind(phraseController),
);

export default router;

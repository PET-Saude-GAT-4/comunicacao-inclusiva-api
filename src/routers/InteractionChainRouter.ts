import express, { type Request, type Response } from "express";

import type { IInteractionChainController } from "@/controllers/interaction-chain/IInteractionChainController.js";
import InteractionChainController from "@/controllers/interaction-chain/InteractionChainController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();
const interactionChainController: IInteractionChainController =
  new InteractionChainController();

const router = express.Router();

router.get(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  interactionChainController.findAll.bind(interactionChainController),
);

router.post(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  interactionChainController.create.bind(interactionChainController),
);

router.get(
  "/trigger-board/:uuid",
  authMiddleware.auth(["super_admin", "admin"]),
  interactionChainController.findByTriggerBoardUuid.bind(
    interactionChainController,
  ),
);

router.get(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin"]),
  interactionChainController.findByUuid.bind(interactionChainController),
);

router.patch(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response) => interactionChainController.update!(req, res),
);

router.delete(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin"]),
  interactionChainController.delete.bind(interactionChainController),
);

export default router;

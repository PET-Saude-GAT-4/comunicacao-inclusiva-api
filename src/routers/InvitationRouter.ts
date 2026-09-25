import express, { type Request, type Response } from "express";

import type { IInvitationController } from "@/controllers/invitation/IInvitationController.js";
import InvitationController from "@/controllers/invitation/InvitationController.js";

const invitationController: IInvitationController = new InvitationController();

const router = express.Router();

router.post("/accept", (req: Request, res: Response) =>
  invitationController.accept(req, res),
);

router.post("/resend", (req: Request, res: Response) =>
  invitationController.resend(req, res),
);

export default router;

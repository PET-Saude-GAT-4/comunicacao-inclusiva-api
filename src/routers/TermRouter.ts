import express from "express";

import type { ITermController } from "@/controllers/term/ITermController.js";
import TermController from "@/controllers/term/TermController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();
const termController: ITermController = new TermController();

const router = express.Router();

router.get(
  "/",
  authMiddleware.auth(["super_admin", "admin", "viewer"]),
  termController.findAll.bind(termController),
);

router.get(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin", "viewer"]),
  termController.findById!.bind(termController),
);

router.post(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  termController.create.bind(termController),
);

router.delete(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin"]),
  termController.delete.bind(termController),
);

export default router;

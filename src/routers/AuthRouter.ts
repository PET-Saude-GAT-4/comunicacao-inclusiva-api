import express, { type Request, type Response } from "express";

import AuthController from "@/controllers/auth/AuthController.js";
import type { IAuthController } from "@/controllers/auth/IAuthController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";
import { RoleEnum } from "@/models/types/Role.type.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();

const authController: IAuthController = new AuthController();

const router = express.Router();

// Public routes
router.post("/login", (req: Request, res: Response) =>
  authController.login(req, res),
);

router.post(
  "/register",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  (req: Request, res: Response) => authController.register(req, res),
);

// Protected routes
router.get(
  "/check-token",
  authMiddleware.auth("all"),
  (req: Request, res: Response) => authController.checkToken(req, res),
);

export default router;

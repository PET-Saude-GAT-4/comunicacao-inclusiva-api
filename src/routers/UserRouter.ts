import express, { type Request, type Response } from "express";

import type { IUserController } from "@/controllers/user/IUserController.js";
import UserController from "@/controllers/user/UserController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();

const userController: IUserController = new UserController();

const router = express.Router();

router.post(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response) => userController.create(req, res),
);

router.get(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response) => userController.findAll(req, res),
);

router.get(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response) => userController.findById!(req, res),
);

router.patch(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response) => userController.update!(req, res),
);

router.delete(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response) => userController.delete(req, res),
);

export default router;

import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

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
  (req: Request, res: Response, next: NextFunction) =>
    userController.create(req, res, next),
);

router.get(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.findAll(req, res, next),
);

router.get(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.findById(req, res, next),
);

router.put(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.update(req, res, next),
);

router.delete(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.delete(req, res, next),
);

export default router;

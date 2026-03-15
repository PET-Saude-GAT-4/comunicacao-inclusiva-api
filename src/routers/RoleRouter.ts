import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import type { IRoleController } from "@/controllers/role/IRoleController.js";
import RoleController from "@/controllers/role/RoleController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();

const roleController: IRoleController = new RoleController();

const router = express.Router();

router.post(
  "/",
  authMiddleware.auth(["super_admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.create(req, res, next),
);

router.get(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.findAll(req, res, next),
);

router.get(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.findById(req, res, next),
);

router.put(
  "/:id",
  authMiddleware.auth(["super_admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.update(req, res, next),
);

router.delete(
  "/:id",
  authMiddleware.auth(["super_admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    roleController.delete(req, res, next),
);

export default router;

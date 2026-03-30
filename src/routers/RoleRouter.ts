import express, { type Request, type Response } from "express";

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
  (req: Request, res: Response) => roleController.create(req, res),
);

router.get(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response) => roleController.findAll(req, res),
);

router.get(
  "/:id",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response) => roleController.findById(req, res),
);

router.put(
  "/:id",
  authMiddleware.auth(["super_admin"]),
  (req: Request, res: Response) => roleController.update(req, res),
);

router.delete(
  "/:id",
  authMiddleware.auth(["super_admin"]),
  (req: Request, res: Response) => roleController.delete(req, res),
);

export default router;

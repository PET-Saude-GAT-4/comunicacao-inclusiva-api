import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import type { IRoleController } from "@/controllers/role/IRoleController.js";
import RoleController from "@/controllers/role/RoleController.js";

const roleController: IRoleController = new RoleController();

const router = express.Router();

// Example:
// router.post("/", (req: Request, res: Response, next: NextFunction) => roleController.create(req, res, next));

export default router;

import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import type { IUserController } from "@/controllers/user/IUserController.js";
import UserController from "@/controllers/user/UserController.js";

const userController: IUserController = new UserController();

const router = express.Router();

// Example:
// router.post("/", (req: Request, res: Response, next: NextFunction) => userController.create(req, res, next));

export default router;

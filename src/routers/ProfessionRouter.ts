import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import type { IProfessionController } from "@/controllers/profession/IProfessionController.js";
import ProfessionController from "@/controllers/profession/ProfessionController.js";

const professionController: IProfessionController = new ProfessionController();

const router = express.Router();

// Example:
// router.post("/", (req: Request, res: Response, next: NextFunction) => professionController.create(req, res, next));

export default router;

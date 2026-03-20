import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import type { IProfessionController } from "@/controllers/profession/IProfessionController.js";
import ProfessionController from "@/controllers/profession/ProfessionController.js";

const professionController: IProfessionController = new ProfessionController();

const router = express.Router();

router.post("/", professionController.create.bind(professionController));
router.get("/findAll", professionController.findAll.bind(professionController));
router.get("/:id", professionController.findById!.bind(professionController));
router.put("/:id", professionController.update!.bind(professionController));
router.delete("/:id", professionController.delete.bind(professionController));

export default router;

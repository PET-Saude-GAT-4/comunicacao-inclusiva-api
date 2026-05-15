import express from "express";

import type { IPictogramController } from "@/controllers/pictogram/IPictogramController.js";
import PictogramController from "@/controllers/pictogram/PictogramController.js";

const pictogramController: IPictogramController = new PictogramController();

const router = express.Router();

router.get("/", pictogramController.findAll.bind(pictogramController));

router.get("/:uuid", pictogramController.findById!.bind(pictogramController));

export default router;

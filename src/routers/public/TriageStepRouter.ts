import express from "express";

import type { ITriageStepController } from "@/controllers/triage-step/ITriageStepController.js";
import TriageStepController from "@/controllers/triage-step/TriageStepController.js";

const triageStepController: ITriageStepController = new TriageStepController();

const router = express.Router();

router.get(
  "/",
  triageStepController.findAllPublished.bind(triageStepController),
);

export default router;

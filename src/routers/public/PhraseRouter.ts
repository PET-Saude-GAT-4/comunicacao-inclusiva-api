import express from "express";

import type { IPhraseController } from "@/controllers/phrase/IPhraseController.js";
import PhraseController from "@/controllers/phrase/PhraseController.js";

const phraseController: IPhraseController = new PhraseController();

const router = express.Router();

router.get("/", phraseController.findAllPublished.bind(phraseController));

router.get(
  "/:uuid",
  phraseController.findPublishedByUuid.bind(phraseController),
);

export default router;

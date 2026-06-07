import express from "express";

import BoardController from "@/controllers/board/BoardController.js";
import type { IBoardController } from "@/controllers/board/IBoardController.js";

const boardController: IBoardController = new BoardController();

const router = express.Router();

router.get("/", boardController.findAllPublished.bind(boardController));

router.get("/:uuid", boardController.findPublishedByUuid.bind(boardController));

router.get(
  "/:uuid/pictograms",
  boardController.findPictogramsByPublishedBoard.bind(boardController),
);

export default router;

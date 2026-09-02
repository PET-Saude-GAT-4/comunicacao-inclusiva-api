import express from "express";

import BoardController from "@/controllers/board/BoardController.js";
import type { IBoardController } from "@/controllers/board/IBoardController.js";

const boardController: IBoardController = new BoardController();

const router = express.Router();

router.get("/", boardController.findAllPublished.bind(boardController));

router.get("/:uuid", boardController.findPublishedByUuid.bind(boardController));

router.get(
  "/:uuid/terms",
  boardController.findTermsByPublishedBoard.bind(boardController),
);

router.get(
  "/:uuid/next-boards",
  boardController.findNextBoardsByPublishedBoard.bind(boardController),
);

export default router;

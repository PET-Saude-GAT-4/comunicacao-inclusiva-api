import express from "express";

import BoardController from "@/controllers/board/BoardController.js";
import type { IBoardController } from "@/controllers/board/IBoardController.js";

const boardController: IBoardController = new BoardController();

const router = express.Router();

router.get("/", boardController.findAll.bind(boardController));

router.get("/:uuid", boardController.findById!.bind(boardController));

router.get(
  "/:uuid/pictograms",
  boardController.findPictograms.bind(boardController),
);

export default router;

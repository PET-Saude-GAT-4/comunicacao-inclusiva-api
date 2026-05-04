import express from "express";

import BoardController from "@/controllers/board/BoardController.js";
import type { IBoardController } from "@/controllers/board/IBoardController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();
const boardController: IBoardController = new BoardController();

const router = express.Router();

router.get(
  "/",
  authMiddleware.auth(["super_admin", "admin", "user"]),
  boardController.findAll.bind(boardController),
);

router.get(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin", "user"]),
  boardController.findById!.bind(boardController),
);

router.post(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.create.bind(boardController),
);

router.get(
  "/:uuid/pictograms",
  authMiddleware.auth(["super_admin", "admin", "user"]),
  boardController.findPictograms.bind(boardController),
);

router.post(
  "/:uuid/pictograms",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.addPictogram.bind(boardController),
);

export default router;

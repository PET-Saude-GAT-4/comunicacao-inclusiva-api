import express, { type Request, type Response } from "express";

import BoardController from "@/controllers/board/BoardController.js";
import type { IBoardController } from "@/controllers/board/IBoardController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();
const boardController: IBoardController = new BoardController();

const router = express.Router();

router.get(
  "/",
  authMiddleware.auth(["super_admin", "admin", "viewer"]),
  boardController.findAll.bind(boardController),
);

router.post(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.create.bind(boardController),
);

router.get(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin", "viewer"]),
  boardController.findById!.bind(boardController),
);

router.patch(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin"]),
  (req: Request, res: Response) => boardController.update!(req, res),
);

router.patch(
  "/:uuid/publish",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.publish.bind(boardController),
);

router.patch(
  "/:uuid/unpublish",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.unpublish.bind(boardController),
);

router.delete(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.delete.bind(boardController),
);

router.get(
  "/:uuid/pictograms",
  authMiddleware.auth(["super_admin", "admin", "viewer"]),
  boardController.findPictograms.bind(boardController),
);

router.post(
  "/:uuid/pictograms",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.addPictogram.bind(boardController),
);

router.delete(
  "/:uuid/pictograms/:pictogramUuid",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.deleteBoardPictogram.bind(boardController),
);

router.patch(
  "/:uuid/pictograms/:pictogramUuid/order",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.reorderPictogram.bind(boardController),
);

export default router;

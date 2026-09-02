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
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.findAll.bind(boardController),
);

router.post(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.create.bind(boardController),
);

router.get(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.findByUuid.bind(boardController),
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
  "/:uuid/terms",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.findTerms.bind(boardController),
);

router.post(
  "/:uuid/terms",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.addTerm.bind(boardController),
);

router.delete(
  "/:uuid/terms/:boardTermUuid",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.deleteBoardTerm.bind(boardController),
);

router.patch(
  "/:uuid/terms/:boardTermUuid/order",
  authMiddleware.auth(["super_admin", "admin"]),
  boardController.reorderTerm.bind(boardController),
);

export default router;

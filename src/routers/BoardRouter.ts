import express, { type Request, type Response } from "express";

import BoardController from "@/controllers/board/BoardController.js";
import type { IBoardController } from "@/controllers/board/IBoardController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";
import { RoleEnum } from "@/models/types/Role.type.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();
const boardController: IBoardController = new BoardController();

const router = express.Router();

router.get(
  "/",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  boardController.findAll.bind(boardController),
);

router.post(
  "/",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  boardController.create.bind(boardController),
);

router.get(
  "/:uuid",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  boardController.findByUuid.bind(boardController),
);

router.patch(
  "/:uuid",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  (req: Request, res: Response) => boardController.update!(req, res),
);

router.patch(
  "/:uuid/publish",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  boardController.publish.bind(boardController),
);

router.patch(
  "/:uuid/unpublish",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  boardController.unpublish.bind(boardController),
);

router.delete(
  "/:uuid",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  boardController.delete.bind(boardController),
);

router.get(
  "/:uuid/terms",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  boardController.findTerms.bind(boardController),
);

router.post(
  "/:uuid/terms",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  boardController.addTerm.bind(boardController),
);

router.delete(
  "/:uuid/terms/:boardTermUuid",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  boardController.deleteBoardTerm.bind(boardController),
);

router.patch(
  "/:uuid/terms/:boardTermUuid/order",
  authMiddleware.auth([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
  boardController.reorderTerm.bind(boardController),
);

export default router;

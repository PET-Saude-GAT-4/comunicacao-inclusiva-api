import express from "express";

import type { IPictogramController } from "@/controllers/pictogram/IPictogramController.js";
import PictogramController from "@/controllers/pictogram/PictogramController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import FileMiddleware from "@/middlewares/FileMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";
import type { IFileMiddleware } from "@/middlewares/IFileMiddleware.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();
const fileMiddleware: IFileMiddleware = new FileMiddleware();
const pictogramController: IPictogramController = new PictogramController();

const router = express.Router();

router.get(
  "/",
  authMiddleware.auth(["super_admin", "admin", "user"]),
  pictogramController.findAll.bind(pictogramController),
);

router.get(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin", "user"]),
  pictogramController.findById!.bind(pictogramController),
);

router.post(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  ...fileMiddleware.validateSingleFile({
    fieldName: "image",
    required: true,
    allowedFileTypes: ["image"],
  }),
  pictogramController.create.bind(pictogramController),
);

router.delete(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin"]),
  pictogramController.delete.bind(pictogramController),
);

export default router;

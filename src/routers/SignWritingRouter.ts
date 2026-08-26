import express from "express";

import type { ISignWritingController } from "@/controllers/sign-writing/ISignWritingController.js";
import SignWritingController from "@/controllers/sign-writing/SignWritingController.js";
import AuthMiddleware from "@/middlewares/AuthMiddleware.js";
import FileMiddleware from "@/middlewares/FileMiddleware.js";
import type { IAuthMiddleware } from "@/middlewares/IAuthMiddleware.js";
import type { IFileMiddleware } from "@/middlewares/IFileMiddleware.js";

const authMiddleware: IAuthMiddleware = new AuthMiddleware();
const fileMiddleware: IFileMiddleware = new FileMiddleware();
const signWritingController: ISignWritingController =
  new SignWritingController();

const router = express.Router();

router.get(
  "/",
  authMiddleware.auth(["super_admin", "admin", "viewer"]),
  signWritingController.findAll.bind(signWritingController),
);

router.get(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin", "viewer"]),
  signWritingController.findById!.bind(signWritingController),
);

router.post(
  "/",
  authMiddleware.auth(["super_admin", "admin"]),
  ...fileMiddleware.validateSingleFile({
    fieldName: "image",
    required: true,
    allowedFileTypes: ["image"],
  }),
  signWritingController.create.bind(signWritingController),
);

router.delete(
  "/:uuid",
  authMiddleware.auth(["super_admin", "admin"]),
  signWritingController.delete.bind(signWritingController),
);

export default router;

import type { NextFunction, Request, Response } from "express";
import express from "express";

import FileController from "@/controllers/file/FileController.js";
import type { IFileController } from "@/controllers/file/IFileController.js";

const fileController: IFileController = new FileController();

const router = express.Router();

router.get("/:uuid", (req: Request, res: Response, next: NextFunction) =>
  fileController.stream(req, res, next),
);

export default router;

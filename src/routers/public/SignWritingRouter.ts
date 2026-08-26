import express from "express";

import type { ISignWritingController } from "@/controllers/sign-writing/ISignWritingController.js";
import SignWritingController from "@/controllers/sign-writing/SignWritingController.js";

const signWritingController: ISignWritingController =
  new SignWritingController();

const router = express.Router();

router.get("/", signWritingController.findAll.bind(signWritingController));

router.get(
  "/:uuid",
  signWritingController.findById!.bind(signWritingController),
);

export default router;

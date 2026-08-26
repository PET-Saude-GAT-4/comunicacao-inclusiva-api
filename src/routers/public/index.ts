import express from "express";

import BoardRouter from "./BoardRouter.js";
import FileRouter from "./FileRouter.js";
import PhraseRouter from "./PhraseRouter.js";
import PictogramRouter from "./PictogramRouter.js";
import ProfessionRouter from "./ProfessionRouter.js";
import SignWritingRouter from "./SignWritingRouter.js";

const router = express.Router();

router.use("/boards", BoardRouter);
router.use("/files", FileRouter);
router.use("/phrases", PhraseRouter);
router.use("/pictograms", PictogramRouter);
router.use("/professions", ProfessionRouter);
router.use("/sign-writings", SignWritingRouter);

export default router;

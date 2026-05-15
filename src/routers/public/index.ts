import express from "express";

import BoardRouter from "./BoardRouter.js";
import FileRouter from "./FileRouter.js";
import PictogramRouter from "./PictogramRouter.js";

const router = express.Router();

router.use("/boards", BoardRouter);
router.use("/files", FileRouter);
router.use("/pictograms", PictogramRouter);

export default router;

import express from "express";

import BoardRouter from "./BoardRouter.js";
import FileRouter from "./FileRouter.js";
import PictogramRouter from "./PictogramRouter.js";
import ProfessionRouter from "./ProfessionRouter.js";
import SpecialityRouter from "./SpecialityRouter.js";

const router = express.Router();

router.use("/boards", BoardRouter);
router.use("/files", FileRouter);
router.use("/pictograms", PictogramRouter);
router.use("/professions", ProfessionRouter);
router.use("/specialities", SpecialityRouter);

export default router;

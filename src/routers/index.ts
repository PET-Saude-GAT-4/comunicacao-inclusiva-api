import express from "express";

import AuthRouter from "./AuthRouter.js";
import BoardRouter from "./BoardRouter.js";
import FileRouter from "./FileRouter.js";
import PictogramRouter from "./PictogramRouter.js";
import ProfessionRouter from "./ProfessionRouter.js";
import RoleRouter from "./RoleRouter.js";
import SpecialityRouter from "./SpecialityRouter.js";
import UserRouter from "./UserRouter.js";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/boards", BoardRouter);
router.use("/files", FileRouter);
router.use("/pictograms", PictogramRouter);
router.use("/professions", ProfessionRouter);
router.use("/roles", RoleRouter);
router.use("/specialities", SpecialityRouter);
router.use("/users", UserRouter);

export default router;

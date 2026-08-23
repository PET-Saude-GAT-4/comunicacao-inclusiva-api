import express from "express";

import AuthRouter from "./AuthRouter.js";
import BoardRouter from "./BoardRouter.js";
import FileRouter from "./FileRouter.js";
import InteractionChainRouter from "./InteractionChainRouter.js";
import PhraseRouter from "./PhraseRouter.js";
import PictogramRouter from "./PictogramRouter.js";
import ProfessionRouter from "./ProfessionRouter.js";
import PublicRouter from "./public/index.js";
import RoleRouter from "./RoleRouter.js";
import SpecialityRouter from "./SpecialityRouter.js";
import UserRouter from "./UserRouter.js";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/boards", BoardRouter);
router.use("/files", FileRouter);
router.use("/interaction-chains", InteractionChainRouter);
router.use("/phrases", PhraseRouter);
router.use("/pictograms", PictogramRouter);
router.use("/professions", ProfessionRouter);
router.use("/public", PublicRouter);
router.use("/roles", RoleRouter);
router.use("/specialities", SpecialityRouter);
router.use("/users", UserRouter);

export default router;

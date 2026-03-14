import express from "express";

import ProfessionRouter from "./ProfessionRouter.js";
import RoleRouter from "./RoleRouter.js";
import SpecialityRouter from "./SpecialityRouter.js";
import UserRouter from "./UserRouter.js";

const router = express.Router();

router.use("/professions", ProfessionRouter);
router.use("/roles", RoleRouter);
router.use("/specialities", SpecialityRouter);
router.use("/users", UserRouter);

export default router;

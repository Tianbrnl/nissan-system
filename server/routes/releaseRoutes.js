import express from "express";
import { releasePlanReport } from "../controllers/releaseControllers.js";

const releaseRouter = express.Router();

releaseRouter.get("/reports/release-plan", releasePlanReport);

export default releaseRouter;
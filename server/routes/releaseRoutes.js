import express from "express";
import { releasePlanReport, updateReleasePlan } from "../controllers/releaseControllers.js";

const releaseRouter = express.Router();

releaseRouter.get("/reports/release-plan", releasePlanReport);
// month end commitment
releaseRouter.put("/reports/release-plan", updateReleasePlan);

export default releaseRouter;
import express from 'express';
import { applicationsApprovalsController, teamPerformanceController } from '../controllers/applicationsApprovalsController.js';

const applicationsApprovalsRouter = express.Router();

// TEAM PERFORMANCE
applicationsApprovalsRouter.get('/teamPerformance/:monthYear', teamPerformanceController);

// APPLICATIONS APPROVALS
applicationsApprovalsRouter.get('/applicationsApprovals/:year', applicationsApprovalsController);

export default applicationsApprovalsRouter;
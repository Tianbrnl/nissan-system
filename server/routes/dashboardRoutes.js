import express from 'express';
import { applicationSoldController, fetchDashboardTotalController, monthlySoldTrendController, paymentTermDistributionCOntroller, reservationByTeamController } from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

// SELECT READ ALL VARIANT
dashboardRouter.get('/totals', fetchDashboardTotalController);

// PAYMENT TERM DISTRIBUTION
dashboardRouter.get('/paymentTermDistribution', paymentTermDistributionCOntroller);

// RESERVATION BY TEAM
dashboardRouter.get('/reservationByTeam', reservationByTeamController);

// MONTHLY SOLD TREND
dashboardRouter.get('/monthlySoldTrend', monthlySoldTrendController);

// APPLICATION SOLD
dashboardRouter.get('/applicationSold', applicationSoldController);


export default dashboardRouter;
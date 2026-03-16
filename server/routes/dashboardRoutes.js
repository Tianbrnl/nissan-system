import express from 'express';
import { fetchDashboardTotalController, paymentTermDistributionCOntroller, reservationByTeamController } from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

// SELECT READ ALL VARIANT
dashboardRouter.get('/totals', fetchDashboardTotalController);

// PAYMENT TERM DISTRIBUTION
dashboardRouter.get('/paymentTermDistribution', paymentTermDistributionCOntroller);

// RESERVATION BY TEAM
dashboardRouter.get('/reservationByTeam', reservationByTeamController);


export default dashboardRouter;
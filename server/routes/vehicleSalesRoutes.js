import express from 'express';
import { readAllTeamPerformanceController } from '../controllers/vehicleSalesController.js';

const vehicleSalesRouter = express.Router();

// SELECT READ ALL VARIANT
vehicleSalesRouter.get('/teamPerformance/:monthYear', readAllTeamPerformanceController);


export default vehicleSalesRouter;
import express from 'express';
import { readAllTeamPerformanceController, unitDestributionController } from '../controllers/vehicleSalesController.js';

const vehicleSalesRouter = express.Router();

// SELECT READ ALL VARIANT
vehicleSalesRouter.get('/teamPerformance/:monthYear', readAllTeamPerformanceController);

// UNIT DESTRIBUTION
vehicleSalesRouter.get('/unitDestribution/:monthYear', unitDestributionController);


export default vehicleSalesRouter;
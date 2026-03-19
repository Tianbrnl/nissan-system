import express from 'express';
import { createPipelineController, deletePipelineController, readAllPipelineController, readOnePipelineController, updatePipelineController, vehicleSalesReport , paymentTermReport, reservationByTeamReport} from '../controllers/pipelineControllers.js';

const pipelineRouter = express.Router();

// CREATE PIPELINE
pipelineRouter.post('/create', createPipelineController);

// READ ONE PIPELINE
pipelineRouter.get('/readOne/:pipelineId', readOnePipelineController);

// READ ALL PIPELINE
pipelineRouter.get('/readAll', readAllPipelineController);

// UPDATE PIPELINE
pipelineRouter.put('/update/:pipelineId', updatePipelineController);

// DELETE PIPELINE
pipelineRouter.delete('/delete/:pipelineId', deletePipelineController);

// vehicleSales report
pipelineRouter.get('/reports/vehicle-sales', vehicleSalesReport);

// payment term monthly
pipelineRouter.get("/reports/payment-term", paymentTermReport);

// reservation by team monthly
pipelineRouter.get("/reports/reservation-team", reservationByTeamReport);

export default pipelineRouter;
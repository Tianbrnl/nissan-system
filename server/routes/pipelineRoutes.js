import express from 'express';
import { createPipelineController, deletePipelineController, readAllPipelineController, readOnePipelineController, updatePipelineController } from '../controllers/pipelineControllers.js';

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

export default pipelineRouter;
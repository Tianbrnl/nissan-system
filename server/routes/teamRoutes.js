import express from 'express'; 
import { createTeamController, deleteTeamController, readAllGrmController, readAllTeamController, readOneTeamController, updateTeamController } from '../controllers/teamControllers.js';

const teamRouter = express.Router();

// CREATE USER 
teamRouter.post('/create', createTeamController);

// READ ONE USER 
teamRouter.get('/readOne/:teamId', readOneTeamController);

// READ ALL USER 
teamRouter.get('/readAll', readAllTeamController);

// READ ALL GRM 
teamRouter.get('/select/grm', readAllGrmController);

// UPDATE USER 
teamRouter.put('/update/:teamId', updateTeamController);

// DELETE USER 
teamRouter.delete('/delete/:teamId', deleteTeamController);


export default teamRouter;
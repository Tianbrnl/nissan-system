import express from 'express'; 
import { createTeamController, deleteTeamController, readAllGrmController, readAllTeamController, readOneTeamController, readTeamMembersController, updateTeamController } from '../controllers/teamControllers.js';
import { readTeamMemberYearlySalesController } from '../controllers/teamMemberSalesController.js';

const teamRouter = express.Router();

// CREATE USER 
teamRouter.post('/create', createTeamController);

// READ ONE USER 
teamRouter.get('/readOne/:teamId', readOneTeamController);

// READ ALL USER 
teamRouter.get('/readAll', readAllTeamController);

// READ ALL GRM 
teamRouter.get('/select/grm', readAllGrmController);

// READ TEAM MEMBERS
teamRouter.get('/members/:teamId', readTeamMembersController);

// READ TEAM MEMBER YEARLY SALES
teamRouter.get('/member-sales/:memberId', readTeamMemberYearlySalesController);

// UPDATE USER 
teamRouter.put('/update/:teamId', updateTeamController);

// DELETE USER 
teamRouter.delete('/delete/:teamId', deleteTeamController);


export default teamRouter;

import express from 'express';
import { userRegistrationController } from '../controllers/userControllers.js';

const userRouter = express.Router();

// REGISTER USER 
userRouter.post('/register', userRegistrationController);

// // LOGIN USER 
// userRouter.post('/login', userLoginController);


export default userRouter;
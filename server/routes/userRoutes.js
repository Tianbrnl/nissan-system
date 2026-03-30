import express from 'express';
import { fetchUserController, logoutUserController, userLoginController } from '../controllers/userControllers.js';
import { authenticateUserJWT } from '../middleware/auth.js';

const userRouter = express.Router();

// LOGIN USER 
userRouter.post('/login', userLoginController);

// LOGOUT USER
userRouter.get('/logout', authenticateUserJWT, logoutUserController);

// FETCH USER
userRouter.get('/fetchUser', authenticateUserJWT, fetchUserController);

export default userRouter;
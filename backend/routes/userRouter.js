import express from 'express';
import { loginUser,registerUser,adminLogin } from '../controllers/userControllers.js'; 

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/adminlogin', adminLogin);

export default userRouter;
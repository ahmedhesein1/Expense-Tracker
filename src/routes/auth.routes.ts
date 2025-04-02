import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

export const authRoutes = Router();

authRoutes.post('/signup', authController.signUp);
authRoutes.post('/login', authController.login);
authRoutes.get('/getInfo/:id',authController.protect ,authController.getUserInfo);

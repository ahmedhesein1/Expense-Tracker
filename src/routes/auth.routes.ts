import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { authController } from '../controllers/auth.controller';
import upload from '../middleware/upload';
import asyncHandler from 'express-async-handler';
import AppError from '../middleware/AppError';

export const authRoutes = Router();

authRoutes.post('/signup', authController.signUp);
authRoutes.post('/login', authController.login);
authRoutes.get(
  '/getInfo/:id',
  authController.protect,
  authController.getUserInfo,
);

authRoutes.post(
  '/upload-image',
  upload.single('image'),
  asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      if (!req.file) {
        return next(new AppError('No file uploaded', 400));
      }
      res
        .status(200)
        .json({ message: 'Upload successful' });
    },
  ),
);

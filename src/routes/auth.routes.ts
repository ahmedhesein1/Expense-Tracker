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
import path from 'path';
import fs from 'fs';

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

      // CHANGED: Updated path resolution to match new upload location
      const filePath = path.join(
        __dirname,
        '../../uploads',
        req.file.filename,
      );

      // Debugging logs to verify file location
      if (!fs.existsSync(filePath)) {
        console.error('File not found at:', filePath);
        return next(
          new AppError('File upload failed', 500),
        );
      }

      // CHANGED: Added proper URL construction with protocol and host
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'Upload successful',
        imageUrl,
        fileInfo: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    },
  ),
);

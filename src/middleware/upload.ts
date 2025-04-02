import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import AppError from './AppError';
import path from 'path';
import fs from 'fs';

// CHANGED: Added proper type definitions
type DestinationCallback = (
  error: Error | null,
  destination: string,
) => void;
type FileNameCallback = (
  error: Error | null,
  filename: string,
) => void;

// CHANGED: Using absolute path and ensuring directory exists
const uploadDir = path.join(__dirname, '../../uploads');

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created uploads directory at: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback,
  ): void => {
    cb(null, uploadDir); // CHANGED: Using absolute path
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback,
  ): void => {
    // CHANGED: Simplified filename generation
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed',
        400,
      ),
    );
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB limit
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;

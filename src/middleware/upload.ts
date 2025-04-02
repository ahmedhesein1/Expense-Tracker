import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import AppError from './AppError';

// Type for the file filter callback
type DestinationCallback = (
  error: Error | null,
  destination: string,
) => void;
type FileNameCallback = (
  error: Error | null,
  filename: string,
) => void;

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback,
  ): void => {
    cb(null, 'uploads/');
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback,
  ): void => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
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
    'image/webp', // Added webp support
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

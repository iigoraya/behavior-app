import path from 'path';
import { Express } from 'express';

export const supportedImageFilter = (
  req,
  file: Express.Multer.File,
  callback,
) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  }
  return callback(null, true);
};

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorMiddleware = (
  error: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error instanceof ApiError ? error.status : 500;
    const message: string = error.message || 'Something went wrong';
    
    console.error(`[ERROR] ${status} - ${message}`);

    res.status(status).json({ status, message });
  } catch (error) {
    next(error);
  }
};
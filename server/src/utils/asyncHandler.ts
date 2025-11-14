import { Request, Response, NextFunction } from 'express';

// Define the type for an Express controller function that can be async
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any> | any;

/**
 * @description Wraps an asynchronous Express controller function.
 * Catches any errors thrown during the execution of the function and 
 * passes them to the Express error handling middleware via `next(error)`.
 * * @param fn The controller function to wrap.
 */
export const asyncHandler = (fn: AsyncController) => 
  (req: Request, res: Response, next: NextFunction) => {
    // Promise.resolve() ensures that the result of `fn` (whether a Promise or a sync value)
    // is treated as a Promise. If an error occurs, .catch(next) forwards it.
    Promise.resolve(fn(req, res, next)).catch(next);
  };
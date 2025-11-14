import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../_shared/interfaces/user.interface';

// ⚠️ Note on Typing: In a full TypeScript project, you would extend Express's 
// Request interface to include the `user` property. For this example, we assume 
// the `req` object has a `user` property added by the preceding authMiddleware.

interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * Middleware to restrict access only to users with the 'admin' role.
 * MUST be run AFTER authMiddleware.
 */
export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Check if user data exists (should be handled by authMiddleware, but we check anyway)
  if (!req.user) {
    // This typically means authMiddleware failed, but we block access anyway
    return next(new ApiError(401, 'Unauthorized access. Authentication required.'));
  }

  // 2. Check the user's role
  if (req.user.role !== 'admin') {
    // 403 Forbidden: The server understood the request but refuses to authorize it.
    return next(
      new ApiError(
        403, 
        `Forbidden. User role '${req.user.role}' is not authorized for this operation.`
      )
    );
  }

  // 3. If the role is 'admin', proceed to the next handler/controller
  next();
};
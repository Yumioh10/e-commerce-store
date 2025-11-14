import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
// Corrected Import: Import the named export 'User' from the model index
import { User, IUserDocument } from '../modules/auth/model/auth.model.ts'

// Custom interface to attach the user to the Express Request object
interface AuthRequest extends Request {
  user?: IUserDocument
}

/**
 * Middleware to verify JWT and attach user data to the request.
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return next(new ApiError(401, 'Access denied. No token provided.'))
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new ApiError(500, 'JWT_SECRET is not defined in environment.')
    }

    // 1. Verify the token
    const decoded = jwt.verify(token, secret) as JwtPayload & { id: string }

    // 2. Find the user (excluding the password)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return next(new ApiError(401, 'Authentication failed. User not found.'))
    }

    // 3. Attach the user object to the request
    req.user = user

    // 4. Proceed to the next middleware or controller
    next()
  } catch (error) {
    // Handle invalid token signatures or expiry
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid or expired token.'))
    }
    // Pass other errors (like database/server issues) to the general handler
    next(error)
  }
}

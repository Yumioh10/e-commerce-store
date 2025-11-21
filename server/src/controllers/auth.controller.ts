import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const authService = new AuthService();

export class AuthController {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      const { user, token } = await authService.register(
        email,
        password,
        firstName,
        lastName
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          token
        }
      });
    } catch (error: any) {
      if (error.message === 'User already exists') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      const { user, token } = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          token
        }
      });
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Get current logged in user profile
   * GET /api/v1/auth/me
   */
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          wishlist: user.wishlist,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   * PUT /api/v1/auth/profile
   */
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const { firstName, lastName, email } = req.body;

      // Prepare fields to update
      const fieldsToUpdate: any = {};
      if (firstName) fieldsToUpdate.firstName = firstName;
      if (lastName) fieldsToUpdate.lastName = lastName;
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
          });
        }
        fieldsToUpdate.email = email;
      }

      const updatedUser = await authService.updateProfile(userId, fieldsToUpdate);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updatedUser._id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role
        }
      });
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Change password
   * PUT /api/v1/auth/password
   */
  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide current password and new password'
        });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error: any) {
      if (error.message === 'Current password is incorrect') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Logout user (frontend-side token removal)
   * POST /api/v1/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // In a stateless JWT system, logout is handled frontend-side
      // You can optionally implement token blacklisting here
      
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add product to wishlist
   * POST /api/v1/auth/wishlist/:productId
   */
  async addToWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const { productId } = req.params;

      const user = await authService.addToWishlist(userId, productId);

      res.status(200).json({
        success: true,
        message: 'Product added to wishlist',
        data: {
          wishlist: user.wishlist
        }
      });
    } catch (error: any) {
      if (error.message === 'Product already in wishlist') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Remove product from wishlist
   * DELETE /api/v1/auth/wishlist/:productId
   */
  async removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const { productId } = req.params;

      const user = await authService.removeFromWishlist(userId, productId);

      res.status(200).json({
        success: true,
        message: 'Product removed from wishlist',
        data: {
          wishlist: user.wishlist
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's wishlist
   * GET /api/v1/auth/wishlist
   */
  async getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;

      const wishlist = await authService.getWishlist(userId);

      res.status(200).json({
        success: true,
        count: wishlist.length,
        data: wishlist
      });
    } catch (error) {
      next(error);
    }
  }
}
export default AuthController
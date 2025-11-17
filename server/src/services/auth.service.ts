import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { config } from '../config/env';

export class AuthService {
  /**
   * Generate JWT token
   */
  generateToken(userId: string): string {
    return jwt.sign(
      { id: userId }, 
      config.jwtSecret as string, 
      { expiresIn: '7d' }
    );
  }

  /**
   * Register a new user
   */
  async register(email: string, password: string, firstName: string, lastName: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User({ 
      email, 
      password, 
      firstName, 
      lastName,
      role: 'customer' 
    });
    await user.save();

    const token = this.generateToken((user._id as any).toString());
    return { user, token };
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken((user._id as any).toString());
    
    // Remove password from response
    user.password = undefined as any;
    
    return { user, token };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: { firstName?: string; lastName?: string; email?: string }) {
    // If email is being updated, check if it's already in use
    if (updates.email) {
      const existingUser = await User.findOne({ 
        email: updates.email, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  /**
   * Add product to user's wishlist
   */
  async addToWishlist(userId: string, productId: string) {
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if product already in wishlist
    if (user.wishlist?.includes(productId as any)) {
      throw new Error('Product already in wishlist');
    }

    // Add product to wishlist
    user.wishlist = user.wishlist || [];
    user.wishlist.push(productId as any);
    await user.save();

    return user;
  }

  /**
   * Remove product from user's wishlist
   */
  async removeFromWishlist(userId: string, productId: string) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist?.filter(
      (id) => id.toString() !== productId
    ) || [];
    
    await user.save();

    return user;
  }

  /**
   * Get user's wishlist with populated product details
   */
  async getWishlist(userId: string) {
    const user = await User.findById(userId).populate({
      path: 'wishlist',
      select: 'name brand category price images rating stock'
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.wishlist || [];
  }

  /**
   * Verify JWT token and return user
   */
  async verifyToken(token: string) {
    try {
      const decoded: any = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
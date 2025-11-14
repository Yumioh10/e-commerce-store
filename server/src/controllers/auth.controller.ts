import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.ts';
import { CreateUserDto } from '../_shared/dtos/create-user.dto';
import { LoginUserDto } from '../_shared/dtos/login-user.dto.ts';

// Instantiate the service that contains the business logic
const authService = new AuthService();

export class AuthController {
  
  /**
   * Handle user registration
   * POST /api/v1/auth/register
   */
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      // The body has been validated by the validateMiddleware
      const userData: CreateUserDto = req.body;
      
      const { user, token } = await authService.register(userData);
      
      // 201 Created
      res.status(201).json({ 
        message: 'User registered successfully', 
        user, 
        token 
      });
    } catch (error) {
      // Pass errors to the global error handler
      next(error); 
    }
  }

  /**
   * Handle user login
   * POST /api/v1/auth/login
   */
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      // The body has been validated by the validateMiddleware
      const loginData: LoginUserDto = req.body;

      const { user, token } = await authService.login(loginData);
      
      // 200 OK
      res.status(200).json({ 
        message: 'Login successful', 
        user, 
        token 
      });
    } catch (error) {
      // Pass errors to the global error handler
      next(error);
    }
  }
}
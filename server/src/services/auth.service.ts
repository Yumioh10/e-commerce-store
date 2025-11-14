import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/jwt.ts';
import { User, IUserDocument } from '../models/user.model';
import { CreateUserDto } from '../_shared/dtos/create-user.dto';
import { LoginUserDto } from '../_shared/dtos/login-user.dto';
import { ApiError } from '../utils/ApiError';

export class AuthService {
  
  private generateToken(userId: string, role: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(500, 'JWT_SECRET is not defined');
    }
    return jwt.sign({ id: userId, role }, secret, { expiresIn: '1d' });
  }

  public async register(userData: CreateUserDto): Promise<{ user: IUserDocument, token: string }> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(409, 'Email already in use');
    }

    const user = new User(userData);
    await user.save();
    
    const token = this.generateToken(user.id, user.role);
    user.password = undefined as any; 
    return { user, token };
  }

  public async login(loginData: LoginUserDto): Promise<{ user: IUserDocument, token: string }> {
    const { email, password } = loginData;
    const user = await User.findOne({ email }).select('+password'); // Explicitly request password
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = this.generateToken(user.id, user.role);
    user.password = undefined as any;
    return { user, token };
  }
}
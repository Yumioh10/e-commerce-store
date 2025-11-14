import jwt from 'jsonwebtoken';
import { IUserDocument } from '../modules/auth/model/auth.model.ts'; 

/**
 * Generates a JSON Web Token (JWT) for the authenticated user.
 * @param user The user document (or ID) to include in the token payload.
 * @returns The signed JWT string.
 */
export const generateToken = (user: IUserDocument | string): string => {
  // Use the user's ID as the identifier in the payload
  const id = typeof user === 'string' ? user : user.id;

  // 💡 Security Note: Ensure process.env.JWT_SECRET is set in your .env file
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
      throw new Error('JWT_SECRET is not defined. Check .env file.');
  }

  // Token expires in 1 day
  return jwt.sign({ id }, secret, {
    expiresIn: '1d', 
  });
};
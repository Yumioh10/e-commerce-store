import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
// Path adjusted for a typical module file structure
import { IUser } from '../../../_shared/interfaces/user.interface'; 

// --- Interfaces for Mongoose Typing ---
// Document Interface (includes Mongoose properties and methods)
export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

// Static Model Interface (for custom static methods)
interface IUserModel extends Model<IUserDocument> {}

// --- Mongoose Schema Definition ---
const userSchema = new Schema<IUserDocument, IUserModel>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false }, // 'select: false' prevents password return by default
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  address: {
    street: { type: String },
    city: { type: String },
    zipCode: { type: String },
  },
}, {
  timestamps: true,
});

// --- Pre-Save Hook (Middleware) for Password Hashing ---
userSchema.pre('save', async function (next) {
  // Hash password only if it's new or has been modified
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Instance Method for Password Comparison ---
userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  if (!this.password) {
     return Promise.resolve(false); 
  }
  // Compare the plain text password with the hashed password
  return bcrypt.compare(password, this.password);
};

// Export the Mongoose Model. We name it 'User' but the file is auth.model.ts.
export const User = model<IUserDocument, IUserModel>('User', userSchema);
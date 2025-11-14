import { Schema, model, Document, Model, models } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../_shared/interfaces/user.interface.ts';

// Interface for the document (includes Mongoose properties)
export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

// Interface for the static model (for custom static methods)
interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument, IUserModel>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  address: {
    street: { type: String },
    city: { type: String },
    zipCode: { type: String },
  },
}, {
  timestamps: true,
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare candidate password with hashed password
userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = (
  models.User || model<IUserDocument, IUserModel>('User', userSchema)) as Model<IUserDocument, IUserModel>;
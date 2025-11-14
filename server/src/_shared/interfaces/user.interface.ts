// Interface for the address sub-document
export interface IUserAddress {
  street?: string;
  city?: string;
  zipCode?: string;
}

// Main User interface
export interface IUser {
  name: string;
  email: string;
  password: string; // This is the shape, even if we don't return it
  role: 'user' | 'admin';
  address?: IUserAddress;
}
import { Document, Types } from "mongoose";

// Interface for Passport and routes
export interface User {
  _id: string;
  name?: string;
  email?: string;
  username?: string; // Added for consistency with userModel
  profilePictureUrl?: string;
  authProvider?: string;
  googleId?: string;
}

// Interface for Mongoose documents
export interface UserDocument extends Document {
  _id: Types.ObjectId;
  username?: string;
  email?: string;
  password?: string;
  profilePictureUrl?: string;
  authProvider?: string;
  googleId?: string;
}

import { ObjectId } from "mongoose";

declare global {
  namespace Express {
    export interface Request {
      userId:ObjectId;
    }
  }
}

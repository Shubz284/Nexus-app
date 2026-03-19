import mongoose, { Document } from "mongoose";
import findOrCreate from "mongoose-findorcreate";

interface IUser extends Document {
  userName: string;
  email: string;
  isEmailPlaceholder: boolean;
  profilePictureUrl?: string;
  authProvider: "google" | "local";
  password?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isEmailPlaceholder: { type: Boolean, default: false },
    profilePictureUrl: { type: String },
    authProvider: {
      type: String,
      enum: ["google", "facebook", "local", "twitter"],
      required: true,
      default: "local",
    },
    password: {
      type: String,
      required: function (this: IUser) {
        // Required if user signs up via local (email/password)
        return this.authProvider === "local";
      },
    },
    googleId: {
      type: String,
      required: function (this: IUser) {
        return this.authProvider === "google";
      },
      unique: true,
      sparse: true, // Allows multiple nulls, only unique if present
    },
  },
  { timestamps: true },
);

const ContentSchema = new mongoose.Schema({
  title: { type: String, require: true },
  link: String,
  // type: { type: String, enum: contentTypes, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  type: String,
  fileName: String,
  fileMimeType: String,
  fileSize: Number,
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const LinkSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

const TagSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

userSchema.plugin(findOrCreate);

const userModel = mongoose.model<IUser>("User", userSchema);
export const LinkModel = mongoose.model("Links", LinkSchema);
export const TagModel = mongoose.model("Tag", TagSchema);
export const ContentModel = mongoose.model("Content", ContentSchema);

export { userModel, IUser };

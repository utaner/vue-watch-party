import mongoose from "mongoose";
import { UserSchema } from "../../types/user";

const userSchema = new mongoose.Schema<UserSchema>(
  {
    username: {
      type: String,
      select:true
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      trim: true,
    
    },
    email: {
      type: String,
      required: [true, "Please provide an email."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email."],
    },
    token: {
      type: String,
      select: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<UserSchema>("User", userSchema);

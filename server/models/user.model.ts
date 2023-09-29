import mongoose from "mongoose";
import { UserSchema } from "../../types/user";

const userSchema = new mongoose.Schema<UserSchema>(
  {
    username: {
      type: String,
      index: {
        unique: true,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false,
      minlength: [10, "Password is too short."],
    },
  },
  { timestamps: true }
);

export default mongoose.model<UserSchema>("User", userSchema);

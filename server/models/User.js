import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    displayName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    user_type: {
      type: String,
      enum: ["student", "working_professional"],
    },
    institution: {
      type: String,
    },
    company: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);

export default User;

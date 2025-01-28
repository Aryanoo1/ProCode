import mongoose from "mongoose";

const UserActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    runs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserActivity = mongoose.model("UserActivity", UserActivitySchema);
export default UserActivity;

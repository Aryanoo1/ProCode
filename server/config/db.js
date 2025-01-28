import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function dbConnect() {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("MongoDB Connected.");
      })
      .catch((err) => {
        console.log("Error connecting to the database", err);
      });
  } catch (err) {
    console.log("Something is wrong", err);
  }
}

export default dbConnect;

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL;

    await mongoose.connect(MONGO_URL as string, {
      serverSelectionTimeoutMS: 30000,
    });
  } catch (err) {
    console.error("error in db", err);
  }
};

mongoose.connection.on("connected", () => {
  console.log("db connected successfully");
});

mongoose.connection.on("disconnected", () => {
  console.log("Database connection disconnected");
});

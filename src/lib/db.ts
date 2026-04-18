import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(MONGO_URI!);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
};
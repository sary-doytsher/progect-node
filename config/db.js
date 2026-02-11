import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "your_mongodb_connection_string_here";
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err.message);
        process.exit(1); // סגירת האפליקציה במקרה של כישלון קריטי
    }
};
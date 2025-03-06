import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const dbConnect = async () => {
    await mongoose
        .connect(process.env.MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("🔥 MongoDB Connected Successfully!");
        })
        .catch((error) => {
            console.log("❌ MongoDB Connection Failed:", error.message);
            process.exit(1);
        });
};

export default dbConnect;
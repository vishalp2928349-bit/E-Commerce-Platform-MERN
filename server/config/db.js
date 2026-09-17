import mongoose from "mongoose";

// Establishes the MongoDB Atlas connection using Mongoose.
// Exits the process on failure so the app never runs in a half-broken state.
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error(
      "\n❌ MONGO_URI is not set.\n" +
      "   1. Make sure a file named '.env' exists inside the 'server/' folder (not just '.env.example').\n" +
      "   2. Open server/.env and set MONGO_URI to your real MongoDB Atlas connection string.\n" +
      "   3. Restart the server.\n"
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

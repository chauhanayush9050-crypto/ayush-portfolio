// =====================================================
// MongoDB Atlas connection
// PHASE 3 NOTE: This will only connect successfully once
// a real MONGO_URI is added to backend/.env
// =====================================================

import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn(
      "[db] MONGO_URI is not set yet. Skipping database connection. " +
        "Add MONGO_URI to backend/.env when you reach Phase 3."
    );
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
    // [AUTH DEBUG] --- temporary, remove after root cause is identified ---
    console.log(`[AUTH DEBUG] Connected database name: "${conn.connection.name}"`);
    console.log(`[AUTH DEBUG] Connection readyState: ${conn.connection.readyState}`);
    // [AUTH DEBUG] --- end block ---
  } catch (error) {
    console.error(`[db] Connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

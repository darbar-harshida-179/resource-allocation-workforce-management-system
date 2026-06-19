// backend/src/server.ts

import crypto from "crypto";
if (!global.crypto) {
  (global as any).crypto = crypto as any;
}

import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";
import { seedAdmin } from "./seeds/adminSeed";

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();

    await seedAdmin();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error(error);
  }
};

startServer();
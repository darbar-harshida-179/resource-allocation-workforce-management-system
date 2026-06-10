// backend/src/seeds/adminSeed.ts

import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/User";

export const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({
      role: UserRole.ADMIN,
    });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@123",
      10
    );

    await User.create({
      firstName: "System",
      lastName: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
      isVerified: true,
    });

    console.log("Admin seeded successfully");
  } catch (error) {
    console.log("Admin seed failed", error);
  }
};
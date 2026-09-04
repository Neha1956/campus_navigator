import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_Navigator";
    console.log("Connecting to MongoDB at:", mongoURI);
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout for quick error catching
    });
    console.log("Connected to MongoDB successfully!");

    const existingAdmin = await User.findOne({ email: "admin@campus.com" });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Admin@123", salt);

      await User.create({
        name: "Campus Admin",
        email: "admin@campus.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("Default admin created successfully!");
      console.log("Email: admin@campus.com");
      console.log("Password: Admin@123");
    } else {
      console.log("Admin account already exists in the database.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
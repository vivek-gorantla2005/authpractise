import { Request, Response } from "express";
import prisma from "../config/db.config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface UserInterface {
  name?: string; // Made optional
  email: string;
  password: string;
  token?: string;
}

// Register function
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password }: UserInterface = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists with this email" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name: name || "Anonymous", // Default name if not provided
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET!,
      { expiresIn: "365d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        token: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Something went wrong. Please try again!" });
  }
};

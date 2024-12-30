import { Request, Response } from "express";
import { getUserByEmail } from "../models/userModel";
import { comparePassword } from "../utils/passwordUtils";
import { generateToken } from "../utils/jwtUtils";

// Controller untuk login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = generateToken({ id: user.user_id, email: user.email });

    const { password: userPassword, ...userWithoutPassword } = user;

    res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

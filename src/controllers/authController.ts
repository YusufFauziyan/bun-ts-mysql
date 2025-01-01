import { Request, Response } from "express";
import {
  getRefreshToken,
  getUserByEmail,
  saveRefreshToken,
  postUser,
  getUserByIdModel,
} from "../models/userModel";
import { comparePassword } from "../utils/passwordUtils";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtUtils";
import { verifyGoogleToken } from "../utils/googleAuth";

// Controller for login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // generate token
    const accessToken = generateAccessToken({
      id: user.user_id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user.user_id,
      email: user.email,
      role: user.role,
    });

    await saveRefreshToken(user.user_id, refreshToken);

    const {
      password: userPassword,
      refresh_token: userRefreshToken,
      ...userWithoutPassword
    } = user;

    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Controller for refresh token
export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  // Check if refresh token is provided
  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  try {
    // Verify the provided refresh token
    const decoded = verifyRefreshToken(refreshToken) as any;

    // Check if the refresh token matches the one stored in the database
    const storedRefreshToken = await getRefreshToken(decoded.id);
    if (storedRefreshToken !== refreshToken) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// Login with Google
export const loginWithGoogle = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: "Google token is required" });
    return;
  }

  try {
    const { email, name } = await verifyGoogleToken(token);
    let user = await getUserByEmail(email);

    if (!user) {
      const newUserData = {
        username: name,
        email,
        verified_email: true,
        password: "", // Empty password for Google users
      };

      const userId = await postUser(newUserData as any);
      user = await getUserByIdModel(userId);

      if (!user) {
        res.status(500).json({ message: "Error creating user" });
        return;
      }
    }

    // generate token
    const accessToken = generateAccessToken({
      id: user.user_id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user.user_id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({ user, accessToken, refreshToken });
  } catch (error) {
    console.error("Error logging in with Google:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

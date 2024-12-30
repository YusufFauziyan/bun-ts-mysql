import jwt from "jsonwebtoken";

const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
if (!ACCESS_SECRET_KEY || !REFRESH_SECRET_KEY) {
  throw new Error("JWT secret key is not provided");
}

// Function to generate token
export const generateAccessToken = (payload: object): string => {
  const token = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: "15m" }); // Token available for 15 minutes
  return token;
};

// Generate refresh token (valid for a longer duration)
export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "7d" }); // 7 days
};

// Function to verify token
export const verifyAccessToken = (token: string): object | string => {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// funtion to verify refresh token
export const verifyRefreshToken = (token: string): object | string => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

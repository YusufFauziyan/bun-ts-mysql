import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY must be defined in environment variables");
}

// Function to generate token
export const generateToken = (payload: object): string => {
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Token available for 1 hour
  return token;
};

// Function to verify token
export const verifyToken = (token: string): object | string => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

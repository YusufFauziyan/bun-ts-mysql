import { Request, Response, NextFunction } from "express";

// Middleware untuk memeriksa role pengguna
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;

  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Access denied." });
    return;
  }

  next();
};

import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { loginUser, refreshAccessToken } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeAdmin } from "../middleware/roleMiddleware";

const router = Router();

// auth
router.post("/auth/login", loginUser);
router.post("/auth/register", createUser);

// refresh token
router.post("/refresh-token", refreshAccessToken);

// Collection Users
router.get("/collection/users", authenticateToken, getAllUsers);
router.get("/collection/user/:id", authenticateToken, authorizeAdmin, getUser);
router.post("/collection/user", createUser);
router.put(
  "/collection/user/:id",
  authenticateToken,
  authorizeAdmin,
  updateUser
);
router.delete(
  "/collection/user/:id",
  authenticateToken,
  authorizeAdmin,
  deleteUser
);

export default router;

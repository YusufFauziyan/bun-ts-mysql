import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { loginUser } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// auth
router.post("/auth/login", loginUser as any);
router.post("/auth/register", createUser as any);

// Collection Users
router.get("/collection/users", authenticateToken, getAllUsers);
router.get("/collection/user/:id", authenticateToken, getUser);
router.post("/collection/user", createUser as any);
router.put("/collection/user/:id", authenticateToken, updateUser as any);
router.delete("/collection/user/:id", authenticateToken, deleteUser as any);

export default router;

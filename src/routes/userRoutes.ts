import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeAdmin } from "../middleware/roleMiddleware";

const router = Router();

// Collection Users
router.get("/users", authenticateToken, getAllUsers);
router.get("/user/:id", authenticateToken, authorizeAdmin, getUser);
router.post("/user", createUser);
router.put("/user/:id", authenticateToken, authorizeAdmin, updateUser);
router.delete("/user/:id", authenticateToken, authorizeAdmin, deleteUser);

export default router;

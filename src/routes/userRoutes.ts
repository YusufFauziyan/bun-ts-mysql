import { Router, Request, Response } from "express";
import db from "../config"; // Impor koneksi yang sudah diubah ke promise
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController"; // Impor fungsi getAllUsers dari controller

const router = Router();

// get all users
router.get("/users", getAllUsers);

// get user by id
router.get("/user/:id", getUser);

// create user
router.post("/user", createUser as any);

// update user
router.put("/user/:id", updateUser as any);

// delete user
router.delete("/user/:id", deleteUser as any);

export default router;

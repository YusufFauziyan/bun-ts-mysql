import { Router } from "express";
import { createUser } from "../controllers/userController";
import {
  loginUser,
  loginWithGoogle,
  refreshAccessToken,
} from "../controllers/authController";

const router = Router();

// auth
router.post("/auth/login", loginUser);
router.post("/auth/register", createUser);
router.post("/auth/google-login", loginWithGoogle);

// refresh token
router.post("/refresh-token", refreshAccessToken);

export default router;

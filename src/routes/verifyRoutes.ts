import { Router } from "express";
import {
  sendVerificationPhoneNumberCode,
  verifyPhoneNumberCode,
} from "../controllers/verifyController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Route to send verification code
router.post(
  "/phone/send-verification",
  authenticateToken,
  sendVerificationPhoneNumberCode
);

// Route to verify code
router.post("/phone/verify-code", authenticateToken, verifyPhoneNumberCode);

export default router;

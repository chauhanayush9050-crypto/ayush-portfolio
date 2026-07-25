import express from "express";
import { loginAdmin, getMe, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", authLimiter, loginAdmin);
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);

export default router;

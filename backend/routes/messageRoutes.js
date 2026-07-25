import express from "express";
import {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} from "../controllers/messageController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { contactLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/", contactLimiter, createMessage);
router.get("/", protect, adminOnly, getMessages);
router.put("/:id/read", protect, adminOnly, markAsRead);
router.delete("/:id", protect, adminOnly, deleteMessage);

export default router;

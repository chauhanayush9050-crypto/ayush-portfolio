import express from "express";
import {
  trackEvent,
  getDashboardStats,
  getCharts,
  getProjectAnalytics,
} from "../controllers/analyticsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { analyticsLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/track", analyticsLimiter, trackEvent);
router.get("/dashboard", protect, adminOnly, getDashboardStats);
router.get("/charts", protect, adminOnly, getCharts);
router.get("/projects", protect, adminOnly, getProjectAnalytics);

export default router;

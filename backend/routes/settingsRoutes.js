import express from "express";
import {
  getSettings,
  updateProfile,
  updateSocialLinks,
  updatePortfolioSettings,
  uploadProfileImage,
  deleteProfileImage,
} from "../controllers/settingsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/profile", protect, adminOnly, updateProfile);
router.put("/social", protect, adminOnly, updateSocialLinks);
router.put("/portfolio", protect, adminOnly, updatePortfolioSettings);
router.post("/images/:field", protect, adminOnly, upload.single("image"), uploadProfileImage);
router.delete("/images/:field", protect, adminOnly, deleteProfileImage);

export default router;

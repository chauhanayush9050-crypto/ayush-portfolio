import express from "express";
import {
  getExperience,
  getExperienceAdmin,
  addExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getExperience);
router.get("/admin", protect, adminOnly, getExperienceAdmin);
router.post("/", protect, adminOnly, addExperience);
router.put("/:entryId", protect, adminOnly, updateExperience);
router.delete("/:entryId", protect, adminOnly, deleteExperience);

export default router;

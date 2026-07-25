import express from "express";
import { getResume, uploadResumeFile, deleteResume } from "../controllers/resumeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import uploadResume from "../middleware/uploadResume.js";

const router = express.Router();

router.get("/", getResume);
router.post("/", protect, adminOnly, uploadResume.single("resume"), uploadResumeFile);
router.delete("/", protect, adminOnly, deleteResume);

export default router;

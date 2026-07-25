import express from "express";
import {
  getEducation,
  getEducationAdmin,
  addEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/educationController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getEducation);
router.get("/admin", protect, adminOnly, getEducationAdmin);
router.post("/", protect, adminOnly, addEducation);
router.put("/:entryId", protect, adminOnly, updateEducation);
router.delete("/:entryId", protect, adminOnly, deleteEducation);

export default router;

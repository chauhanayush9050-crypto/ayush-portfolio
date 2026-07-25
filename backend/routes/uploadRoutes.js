// =====================================================
// Generic image upload endpoint used by the admin panel
// (project screenshots, etc.)
// Returns the hosted URL so it can be saved on the
// relevant document (Project.image, ...)
// =====================================================

import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const fileUrl = req.file.path || `/uploads/${req.file.filename}`;

  res.status(201).json({ success: true, data: { url: fileUrl } });
});

export default router;

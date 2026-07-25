// =====================================================
// Resume controller — upload / replace / delete / get resume
// PHASE 3 NOTE: file storage uses Cloudinary once configured,
// otherwise falls back to local /uploads (see middleware/uploadResume.js)
//
// Only one Resume document exists at any time. Replacing deletes
// the previous file from Cloudinary (or local disk) before saving
// the new one, so no orphaned files accumulate.
// =====================================================

import fs from "fs";
import asyncHandler from "express-async-handler";
import Resume from "../models/Resume.js";
import cloudinary from "../config/cloudinary.js";

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

// Deletes the previously stored resume file (Cloudinary or local disk)
const deleteStoredFile = async (resume) => {
  if (!resume) return;

  if (hasCloudinaryConfig && resume.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(resume.cloudinaryPublicId, { resource_type: "raw" });
    } catch (err) {
      console.error("[resume] Failed to delete old Cloudinary file:", err.message);
    }
  } else if (!hasCloudinaryConfig && resume.fileUrl?.startsWith("/uploads/")) {
    const localPath = `.${resume.fileUrl}`;
    fs.unlink(localPath, (err) => {
      if (err) console.error("[resume] Failed to delete old local file:", err.message);
    });
  }
};

// @desc    Get current resume info (URL to view/download)
// @route   GET /api/resume
// @access  Public
const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne();

  if (!resume || !resume.fileUrl) {
    return res.json({
      success: true,
      data: null,
      message: "No resume has been uploaded yet",
    });
  }

  res.json({ success: true, data: resume });
});

// @desc    Upload or replace the resume PDF (only one active resume ever exists)
// @route   POST /api/resume
// @access  Private/Admin
const uploadResumeFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const existing = await Resume.findOne();

  // Replacing: remove the old file from storage before saving the new one
  if (existing) {
    await deleteStoredFile(existing);
  }

  const fileUrl = req.file.path || `/uploads/${req.file.filename}`;
  const cloudinaryPublicId = hasCloudinaryConfig ? req.file.filename : "";

  const resume = await Resume.findOneAndUpdate(
    {},
    {
      fileUrl,
      fileName: req.file.originalname,
      cloudinaryPublicId,
      uploadedAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ success: true, data: resume });
});

// @desc    Delete the current resume
// @route   DELETE /api/resume
// @access  Private/Admin
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne();

  if (!resume || !resume.fileUrl) {
    res.status(404);
    throw new Error("No resume to delete");
  }

  await deleteStoredFile(resume);
  await Resume.deleteOne({ _id: resume._id });

  res.json({ success: true, message: "Resume deleted" });
});

export { getResume, uploadResumeFile, deleteResume };

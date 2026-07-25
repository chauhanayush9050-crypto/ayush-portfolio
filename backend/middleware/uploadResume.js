// =====================================================
// Resume upload middleware
// Uses Cloudinary "raw" resource type (correct for PDFs,
// as opposed to "image") when credentials are present,
// otherwise falls back to local disk storage under /uploads.
// =====================================================

import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let storage;

if (hasCloudinaryConfig) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "ayush-portfolio/resume",
      resource_type: "raw",
      allowed_formats: ["pdf"],
    },
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "resume-" + uniqueSuffix + path.extname(file.originalname));
    },
  });
}

const uploadResume = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const isPdf =
      path.extname(file.originalname).toLowerCase() === ".pdf" &&
      file.mimetype === "application/pdf";
    if (isPdf) return cb(null, true);
    cb(new Error("Only PDF files are allowed for the resume"));
  },
});

export default uploadResume;

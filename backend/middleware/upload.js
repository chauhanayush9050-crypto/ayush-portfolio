// =====================================================
// Upload middleware
// Uses Cloudinary storage when credentials are present,
// otherwise falls back to local disk storage under /uploads
// so development can continue before Phase 3 credentials exist.
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
      folder: "ayush-portfolio",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "svg", "pdf"],
    },
  });
} else {
  // Local fallback storage (development only, until Cloudinary is configured)
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|pdf/;
    const extValid = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = allowed.test(file.mimetype);
    if (extValid && mimeValid) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpg, jpeg, png, webp, svg) and PDF files are allowed"));
  },
});

export default upload;

// =====================================================
// Resume model — singleton document tracking the
// currently active resume PDF. Only one Resume document
// should ever exist; the controller enforces this by
// always using findOneAndUpdate with upsert.
// =====================================================

import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      default: "", // set once the admin uploads a PDF via the dashboard
    },
    fileName: {
      type: String,
      default: "",
    },
    cloudinaryPublicId: {
      // Needed to delete the old file from Cloudinary when replacing.
      // Empty when using local fallback storage (no Cloudinary asset to clean up).
      type: String,
      default: "",
    },
    uploadedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);

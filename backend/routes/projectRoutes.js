import express from "express";
import {
  getProjects,
  getProjectsAdmin,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  uploadThumbnail,
  deleteThumbnail,
  uploadBanner,
  deleteBanner,
  addGalleryImage,
  removeGalleryImage,
} from "../controllers/projectController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// NOTE: "/admin" must be registered before "/:id" or Express will
// treat "admin" as an :id value.
router.get("/", getProjects);
router.get("/admin", protect, adminOnly, getProjectsAdmin);
router.get("/:id", getProjectById);
router.post("/", protect, adminOnly, createProject);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);

// Image management — each independent so thumbnail/banner/gallery
// entries can be uploaded, replaced, or removed without touching
// the rest of the project's data.
router.post("/:id/thumbnail", protect, adminOnly, upload.single("image"), uploadThumbnail);
router.delete("/:id/thumbnail", protect, adminOnly, deleteThumbnail);
router.post("/:id/banner", protect, adminOnly, upload.single("image"), uploadBanner);
router.delete("/:id/banner", protect, adminOnly, deleteBanner);
router.post("/:id/gallery", protect, adminOnly, upload.single("image"), addGalleryImage);
router.delete("/:id/gallery/:imageId", protect, adminOnly, removeGalleryImage);

export default router;

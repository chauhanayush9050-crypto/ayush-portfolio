// =====================================================
// Project controller — CRUD for portfolio projects, with a
// draft/publish split: the public site only ever sees published
// projects; the admin panel sees everything (draft + published).
//
// Image management (thumbnail, banner, gallery) uses dedicated
// endpoints so each image can be uploaded/replaced/removed
// independently, with the old Cloudinary file deleted whenever
// one is replaced — the same pattern already used for Resume and
// Profile Settings images.
// =====================================================

import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

// Deletes a previously stored image (Cloudinary or local disk fallback)
const deleteStoredImage = async (image) => {
  if (!image || !image.url) return;

  if (hasCloudinaryConfig && image.publicId) {
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (err) {
      console.error("[project] Failed to delete old Cloudinary image:", err.message);
    }
  } else if (!hasCloudinaryConfig && image.url.startsWith("/uploads/")) {
    const localPath = `.${image.url}`;
    fs.unlink(localPath, (err) => {
      if (err) console.error("[project] Failed to delete old local image:", err.message);
    });
  }
};

// @desc    Get published projects only (public site)
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
});

// @desc    Get all projects, draft + published (admin dashboard)
// @route   GET /api/projects/admin
// @access  Private/Admin
const getProjectsAdmin = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
});

// @desc    Get single PUBLISHED project by id (public project details page)
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, isPublished: true });

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json({ success: true, data: project });
});

// @desc    Create a new project (defaults to draft/unpublished)
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

// Fields the admin form is actually allowed to edit via this endpoint.
// Image fields (thumbnail/banner/gallery) are managed exclusively through
// their own dedicated endpoints below, and internal fields (_id, __v,
// createdAt, updatedAt) must never be settable from client input — doing
// so previously let a stale form payload overwrite the document's real
// version number, causing spurious VersionErrors on save.
const EDITABLE_PROJECT_FIELDS = [
  "title",
  "shortDescription",
  "fullDescription",
  "technologies",
  "features",
  "challenges",
  "solutions",
  "githubUrl",
  "liveUrl",
  "category",
  "status",
  "featured",
  "isPublished",
  "order",
];

// @desc    Update a project (text/data fields — images are managed separately)
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  for (const field of EDITABLE_PROJECT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      project[field] = req.body[field];
    }
  }

  const updated = await project.save();

  res.json({ success: true, data: updated });
});

// @desc    Delete a project (and clean up all of its Cloudinary images)
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  await deleteStoredImage(project.thumbnail);
  await deleteStoredImage(project.banner);
  await Promise.all((project.gallery || []).map((img) => deleteStoredImage(img)));

  await project.deleteOne();
  res.json({ success: true, message: "Project deleted" });
});

// @desc    Upload / replace the project thumbnail
// @route   POST /api/projects/:id/thumbnail
// @access  Private/Admin
const uploadThumbnail = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  await deleteStoredImage(project.thumbnail);

  const url = req.file.path || `/uploads/${req.file.filename}`;
  const publicId = hasCloudinaryConfig ? req.file.filename : "";
  project.thumbnail = { url, publicId };
  await project.save();

  res.status(201).json({ success: true, data: project.thumbnail });
});

// @desc    Delete the project thumbnail
// @route   DELETE /api/projects/:id/thumbnail
// @access  Private/Admin
const deleteThumbnail = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  await deleteStoredImage(project.thumbnail);
  project.thumbnail = { url: "", publicId: "" };
  await project.save();

  res.json({ success: true, message: "Thumbnail deleted" });
});

// @desc    Upload / replace the project banner
// @route   POST /api/projects/:id/banner
// @access  Private/Admin
const uploadBanner = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  await deleteStoredImage(project.banner);

  const url = req.file.path || `/uploads/${req.file.filename}`;
  const publicId = hasCloudinaryConfig ? req.file.filename : "";
  project.banner = { url, publicId };
  await project.save();

  res.status(201).json({ success: true, data: project.banner });
});

// @desc    Delete the project banner
// @route   DELETE /api/projects/:id/banner
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  await deleteStoredImage(project.banner);
  project.banner = { url: "", publicId: "" };
  await project.save();

  res.json({ success: true, message: "Banner deleted" });
});

// @desc    Add a single image to the project gallery (max 20)
// @route   POST /api/projects/:id/gallery
// @access  Private/Admin
const addGalleryImage = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  if (project.gallery.length >= 20) {
    res.status(400);
    throw new Error("A project can have at most 20 gallery images");
  }

  const url = req.file.path || `/uploads/${req.file.filename}`;
  const publicId = hasCloudinaryConfig ? req.file.filename : "";
  project.gallery.push({ url, publicId });
  await project.save();

  res.status(201).json({ success: true, data: project.gallery });
});

// @desc    Remove a single image from the project gallery
// @route   DELETE /api/projects/:id/gallery/:imageId
// @access  Private/Admin
const removeGalleryImage = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const image = project.gallery.id(req.params.imageId);
  if (!image) {
    res.status(404);
    throw new Error("Gallery image not found");
  }

  await deleteStoredImage(image);
  image.deleteOne();
  await project.save();

  res.json({ success: true, data: project.gallery });
});

export {
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
};

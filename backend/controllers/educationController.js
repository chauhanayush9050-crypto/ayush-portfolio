// =====================================================
// Education controller — CRUD on the `education` array
// inside the singleton Settings document, with a draft/publish
// split: public site sees only published entries, admin sees all.
// =====================================================

import asyncHandler from "express-async-handler";
import Settings from "../models/Settings.js";

const getSettingsDoc = async () =>
  Settings.findOneAndUpdate({}, {}, { upsert: true, new: true, setDefaultsOnInsert: true });

// @desc    Get published education entries (public site)
// @route   GET /api/education
// @access  Public
const getEducation = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  const published = settings.education.filter((e) => e.isPublished);
  res.json({ success: true, data: published });
});

// @desc    Get all education entries, draft + published (admin dashboard)
// @route   GET /api/education/admin
// @access  Private/Admin
const getEducationAdmin = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  res.json({ success: true, data: settings.education });
});

// @desc    Add education entry (defaults to draft/unpublished)
// @route   POST /api/education
// @access  Private/Admin
const addEducation = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  settings.education.push(req.body);
  await settings.save();
  res.status(201).json({ success: true, data: settings.education });
});

// @desc    Update education entry
// @route   PUT /api/education/:entryId
// @access  Private/Admin
const updateEducation = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  const entry = settings.education.id(req.params.entryId);

  if (!entry) {
    res.status(404);
    throw new Error("Education entry not found");
  }

  Object.assign(entry, req.body);
  await settings.save();

  res.json({ success: true, data: settings.education });
});

// @desc    Delete education entry
// @route   DELETE /api/education/:entryId
// @access  Private/Admin
const deleteEducation = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  settings.education.id(req.params.entryId)?.deleteOne();
  await settings.save();
  res.json({ success: true, data: settings.education });
});

export { getEducation, getEducationAdmin, addEducation, updateEducation, deleteEducation };

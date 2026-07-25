// =====================================================
// Experience controller — CRUD on the `experience` array
// inside the singleton Settings document, with a draft/publish
// split: public site sees only published entries, admin sees all.
// =====================================================

import asyncHandler from "express-async-handler";
import Settings from "../models/Settings.js";

const getSettingsDoc = async () =>
  Settings.findOneAndUpdate({}, {}, { upsert: true, new: true, setDefaultsOnInsert: true });

// @desc    Get published experience entries (public site)
// @route   GET /api/experience
// @access  Public
const getExperience = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  const published = settings.experience.filter((e) => e.isPublished);
  res.json({ success: true, data: published });
});

// @desc    Get all experience entries, draft + published (admin dashboard)
// @route   GET /api/experience/admin
// @access  Private/Admin
const getExperienceAdmin = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  res.json({ success: true, data: settings.experience });
});

// @desc    Add experience entry (defaults to draft/unpublished)
// @route   POST /api/experience
// @access  Private/Admin
const addExperience = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  settings.experience.push(req.body);
  await settings.save();
  res.status(201).json({ success: true, data: settings.experience });
});

// @desc    Update experience entry
// @route   PUT /api/experience/:entryId
// @access  Private/Admin
const updateExperience = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  const entry = settings.experience.id(req.params.entryId);

  if (!entry) {
    res.status(404);
    throw new Error("Experience entry not found");
  }

  Object.assign(entry, req.body);
  await settings.save();

  res.json({ success: true, data: settings.experience });
});

// @desc    Delete experience entry
// @route   DELETE /api/experience/:entryId
// @access  Private/Admin
const deleteExperience = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  settings.experience.id(req.params.entryId)?.deleteOne();
  await settings.save();
  res.json({ success: true, data: settings.experience });
});

export { getExperience, getExperienceAdmin, addExperience, updateExperience, deleteExperience };

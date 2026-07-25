// =====================================================
// Skill controller — CRUD for skills, with a draft/publish split:
// the public route only returns published skills, while the
// admin route returns everything (draft + published) for management.
// =====================================================

import asyncHandler from "express-async-handler";
import Skill from "../models/Skill.js";

// @desc    Get published skills only (public site)
// @route   GET /api/skills
// @access  Public
const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ isPublished: true }).sort({ category: 1, order: 1 });
  res.json({ success: true, count: skills.length, data: skills });
});

// @desc    Get all skills, draft + published (admin dashboard)
// @route   GET /api/skills/admin
// @access  Private/Admin
const getSkillsAdmin = asyncHandler(async (req, res) => {
  const skills = await Skill.find().sort({ category: 1, order: 1 });
  res.json({ success: true, count: skills.length, data: skills });
});

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private/Admin
const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json({ success: true, data: skill });
});

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error("Skill not found");
  }

  Object.assign(skill, req.body);
  const updated = await skill.save();

  res.json({ success: true, data: updated });
});

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error("Skill not found");
  }

  await skill.deleteOne();
  res.json({ success: true, message: "Skill deleted" });
});

export { getSkills, getSkillsAdmin, createSkill, updateSkill, deleteSkill };

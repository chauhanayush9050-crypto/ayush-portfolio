// =====================================================
// About controller — operates on the singleton Settings doc.
// Covers both the About text and the About "feature cards"
// (e.g. Problem Solving, Web Development, ...), which follow
// the same draft/publish pattern already used for Experience
// and Education entries.
// =====================================================

import asyncHandler from "express-async-handler";
import Settings from "../models/Settings.js";

const getSettingsDoc = async () =>
  Settings.findOneAndUpdate({}, {}, { upsert: true, new: true, setDefaultsOnInsert: true });

// @desc    Get about text
// @route   GET /api/about
// @access  Public
const getAbout = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  res.json({ success: true, data: { aboutText: settings.aboutText } });
});

// @desc    Update about text
// @route   PUT /api/about
// @access  Private/Admin
const updateAbout = asyncHandler(async (req, res) => {
  const { aboutText } = req.body;

  const settings = await Settings.findOneAndUpdate(
    {},
    { aboutText },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, data: { aboutText: settings.aboutText } });
});

// @desc    Get published feature cards, sorted by order (public site)
// @route   GET /api/about/feature-cards
// @access  Public
const getFeatureCards = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  const published = settings.featureCards
    .filter((c) => c.isPublished)
    .sort((a, b) => a.order - b.order);
  res.json({ success: true, data: published });
});

// @desc    Get all feature cards, draft + published (admin dashboard)
// @route   GET /api/about/feature-cards/admin
// @access  Private/Admin
const getFeatureCardsAdmin = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  const cards = [...settings.featureCards].sort((a, b) => a.order - b.order);
  res.json({ success: true, data: cards });
});

// @desc    Add a feature card (defaults to draft/unpublished)
// @route   POST /api/about/feature-cards
// @access  Private/Admin
const addFeatureCard = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  settings.featureCards.push(req.body);
  await settings.save();
  res.status(201).json({ success: true, data: settings.featureCards });
});

// @desc    Update a feature card (title, icon, order, isPublished)
// @route   PUT /api/about/feature-cards/:cardId
// @access  Private/Admin
const updateFeatureCard = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  const card = settings.featureCards.id(req.params.cardId);

  if (!card) {
    res.status(404);
    throw new Error("Feature card not found");
  }

  const { title, icon, order, isPublished } = req.body;
  if (title !== undefined) card.title = title;
  if (icon !== undefined) card.icon = icon;
  if (order !== undefined) card.order = order;
  if (isPublished !== undefined) card.isPublished = isPublished;

  await settings.save();
  res.json({ success: true, data: settings.featureCards });
});

// @desc    Delete a feature card
// @route   DELETE /api/about/feature-cards/:cardId
// @access  Private/Admin
const deleteFeatureCard = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();
  settings.featureCards.id(req.params.cardId)?.deleteOne();
  await settings.save();
  res.json({ success: true, data: settings.featureCards });
});

export {
  getAbout,
  updateAbout,
  getFeatureCards,
  getFeatureCardsAdmin,
  addFeatureCard,
  updateFeatureCard,
  deleteFeatureCard,
};

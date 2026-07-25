// =====================================================
// Settings controller — Profile / Settings CMS module:
//   - Personal information
//   - Social links (13 platforms)
//   - Profile images (photo, cover, logo, favicon) with
//     automatic Cloudinary cleanup on replace/delete
//   - Portfolio / SEO settings
//
// Everything lives on the singleton Settings document.
// Nothing here is ever pre-filled with sample data — every
// field defaults to an empty string until the admin sets it.
// =====================================================

import fs from "fs";
import asyncHandler from "express-async-handler";
import Settings from "../models/Settings.js";
import cloudinary from "../config/cloudinary.js";

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const IMAGE_FIELDS = ["profilePhoto", "coverImage", "logo", "favicon"];

const getSettingsDoc = async () =>
  Settings.findOneAndUpdate({}, {}, { upsert: true, new: true, setDefaultsOnInsert: true });

// Deletes a previously stored image (Cloudinary or local disk)
const deleteStoredImage = async (image) => {
  if (!image || !image.url) return;

  if (hasCloudinaryConfig && image.publicId) {
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (err) {
      console.error("[settings] Failed to delete old Cloudinary image:", err.message);
    }
  } else if (!hasCloudinaryConfig && image.url.startsWith("/uploads/")) {
    const localPath = `.${image.url}`;
    fs.unlink(localPath, (err) => {
      if (err) console.error("[settings] Failed to delete old local image:", err.message);
    });
  }
};

// @desc    Get public profile/settings data (personal info, social links,
//          images, portfolio/SEO settings) for the live site
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();

  res.json({
    success: true,
    data: {
      profile: settings.profile,
      socialLinks: settings.socialLinks,
      images: {
        profilePhoto: settings.images.profilePhoto.url,
        coverImage: settings.images.coverImage.url,
        logo: settings.images.logo.url,
        favicon: settings.images.favicon.url,
      },
      portfolioSettings: settings.portfolioSettings,
    },
  });
});

// @desc    Update personal information
// @route   PUT /api/settings/profile
// @access  Private/Admin
const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, headline, bio, email, phone, location, website } = req.body;

  const settings = await Settings.findOneAndUpdate(
    {},
    {
      profile: {
        fullName: fullName ?? "",
        headline: headline ?? "",
        bio: bio ?? "",
        email: email ?? "",
        phone: phone ?? "",
        location: location ?? "",
        website: website ?? "",
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, data: settings.profile });
});

// @desc    Update social links (partial updates merge with existing values —
//          set a field to an empty string to remove/hide that platform)
// @route   PUT /api/settings/social
// @access  Private/Admin
const updateSocialLinks = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();

  const allowedKeys = Object.keys(settings.socialLinks.toObject());
  for (const key of Object.keys(req.body)) {
    if (allowedKeys.includes(key)) {
      settings.socialLinks[key] = req.body[key] ?? "";
    }
  }

  await settings.save();
  res.json({ success: true, data: settings.socialLinks });
});

// @desc    Update portfolio / SEO settings
// @route   PUT /api/settings/portfolio
// @access  Private/Admin
const updatePortfolioSettings = asyncHandler(async (req, res) => {
  const settings = await getSettingsDoc();

  const allowedKeys = Object.keys(settings.portfolioSettings.toObject());
  for (const key of Object.keys(req.body)) {
    if (allowedKeys.includes(key)) {
      settings.portfolioSettings[key] = req.body[key] ?? "";
    }
  }

  await settings.save();
  res.json({ success: true, data: settings.portfolioSettings });
});

// @desc    Upload / replace a profile image (profilePhoto, coverImage, logo, favicon)
// @route   POST /api/settings/images/:field
// @access  Private/Admin
const uploadProfileImage = asyncHandler(async (req, res) => {
  const { field } = req.params;

  if (!IMAGE_FIELDS.includes(field)) {
    res.status(400);
    throw new Error(`Invalid image field. Must be one of: ${IMAGE_FIELDS.join(", ")}`);
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const settings = await getSettingsDoc();
  const existing = settings.images[field];

  // Replacing: remove the old file from storage before saving the new one
  if (existing?.url) {
    await deleteStoredImage(existing);
  }

  const url = req.file.path || `/uploads/${req.file.filename}`;
  const publicId = hasCloudinaryConfig ? req.file.filename : "";

  settings.images[field] = { url, publicId };
  await settings.save();

  res.status(201).json({ success: true, data: { field, url } });
});

// @desc    Delete a profile image (profilePhoto, coverImage, logo, favicon)
// @route   DELETE /api/settings/images/:field
// @access  Private/Admin
const deleteProfileImage = asyncHandler(async (req, res) => {
  const { field } = req.params;

  if (!IMAGE_FIELDS.includes(field)) {
    res.status(400);
    throw new Error(`Invalid image field. Must be one of: ${IMAGE_FIELDS.join(", ")}`);
  }

  const settings = await getSettingsDoc();
  const existing = settings.images[field];

  if (!existing?.url) {
    res.status(404);
    throw new Error("No image to delete for this field");
  }

  await deleteStoredImage(existing);
  settings.images[field] = { url: "", publicId: "" };
  await settings.save();

  res.json({ success: true, message: `${field} deleted` });
});

export {
  getSettings,
  updateProfile,
  updateSocialLinks,
  updatePortfolioSettings,
  uploadProfileImage,
  deleteProfileImage,
};

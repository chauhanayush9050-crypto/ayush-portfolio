// =====================================================
// Settings model — a single "site content" document that
// holds everything the admin can edit outside of the
// Projects / Skills collections: About text, About feature
// cards, Experience entries, Education entries, social links,
// and simple visitor analytics.
//
// There should only ever be ONE document in this collection
// (enforced by always using findOne / findOneAndUpdate with
// upsert in the controller).
// =====================================================

import mongoose from "mongoose";

const experienceEntrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    period: { type: String, default: "" }, // e.g. "2023 - Present"
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Development", "Salesforce", "Other"],
      default: "Development",
    },
    isPublished: {
      // Draft/publish system: defaults to false (draft) until
      // explicitly published from the admin panel.
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const educationEntrySchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    period: { type: String, default: "" },
    description: { type: String, default: "" },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const featureCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: {
      // Must match one of the curated icon names in
      // frontend/src/config/featureIcons.js (FEATURE_ICON_NAMES) —
      // kept in sync manually since this is a small, deliberately
      // fixed set rather than free-form icon uploads.
      type: String,
      enum: [
        "Code2",
        "Server",
        "Cloud",
        "Puzzle",
        "GraduationCap",
        "Layers",
        "Wrench",
        "Users",
        "FileText",
        "Lock",
        "CheckCircle2",
        "MessageSquare",
      ],
      required: true,
    },
    order: { type: Number, default: 0 },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const settingsSchema = new mongoose.Schema(
  {
    aboutText: {
      type: String,
      default: "",
    },
    featureCards: [featureCardSchema],
    experience: [experienceEntrySchema],
    education: [educationEntrySchema],

    // ---- Personal Information ----
    // All fields empty by default — nothing is ever pre-filled.
    profile: {
      fullName: { type: String, default: "" },
      headline: { type: String, default: "" },
      bio: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      website: { type: String, default: "" },
    },

    // ---- Social Links ----
    // Every platform defaults to an empty string. The frontend hides
    // any icon whose URL is empty rather than showing a broken/fake link.
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
      facebook: { type: String, default: "" },
      medium: { type: String, default: "" },
      devto: { type: String, default: "" },
      leetcode: { type: String, default: "" },
      hackerrank: { type: String, default: "" },
      codechef: { type: String, default: "" },
      codeforces: { type: String, default: "" },
      geeksforgeeks: { type: String, default: "" },
    },

    // ---- Profile Images ----
    // Each stores the Cloudinary secure URL plus its public_id, so the
    // old asset can be deleted from Cloudinary whenever it's replaced.
    images: {
      profilePhoto: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
      },
      coverImage: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
      },
      logo: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
      },
      favicon: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
      },
    },

    // ---- Portfolio / SEO Settings ----
    portfolioSettings: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      seoTitle: { type: String, default: "" },
      seoDescription: { type: String, default: "" },
      footerText: { type: String, default: "" },
      copyrightText: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);

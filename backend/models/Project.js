// =====================================================
// Project model
// =====================================================

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      default: "",
    },
    thumbnail: {
      // Shown on the project cards in the public grid and used as the
      // fallback hero image on the detail page if no banner is set.
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    banner: {
      // Larger hero image shown at the top of the project detail page.
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    gallery: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, default: "" },
        },
      ],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: "A project can have at most 20 gallery images.",
      },
    },
    technologies: [
      {
        type: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    challenges: {
      type: String,
      default: "",
    },
    solutions: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    liveUrl: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Full Stack", "Frontend", "Backend", "Salesforce", "Other"],
      default: "Full Stack",
    },
    status: {
      type: String,
      enum: ["Completed", "In Progress", "Planned"],
      default: "In Progress",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      // Draft/publish system: draft projects only appear in the admin
      // panel. Defaults to false so nothing goes live automatically.
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);

// =====================================================
// AnalyticsEvent model — a single collection of granular
// visitor events, used to compute every dashboard stat and
// chart via aggregation queries rather than maintained
// counters (simpler, no drift, one source of truth).
//
// Privacy: no personal or sensitive data is ever stored here.
// The visitor's IP address is used only transiently (in the
// request handler) to look up an approximate country/city via
// an offline database — the raw IP itself is never persisted.
// `visitorId` is an anonymous, randomly-generated identifier
// created client-side (stored in the visitor's own browser),
// not tied to any personal information.
// =====================================================

import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "pageview", // a section/page becoming visible: home, about, skills, projects, experience, education, contact
        "project_view", // an individual project's detail page was opened
        "resume_download",
        "github_click",
        "linkedin_click",
        "contact_click", // "Contact Me" / "Hire Me" CTA click (distinct from actually submitting the form)
      ],
      required: true,
    },
    page: {
      // populated when type === "pageview"
      type: String,
      enum: ["home", "about", "skills", "projects", "experience", "education", "contact", ""],
      default: "",
    },
    project: {
      // populated when type === "project_view"
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    visitorId: {
      type: String,
      required: true,
    },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    deviceType: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet", "Unknown"],
      default: "Unknown",
    },
    browser: { type: String, default: "" },
    os: { type: String, default: "" },
    referrerSource: { type: String, default: "Direct" },
  },
  { timestamps: true }
);

// Indexes to keep the dashboard/chart aggregation queries fast
analyticsEventSchema.index({ type: 1, createdAt: -1 });
analyticsEventSchema.index({ visitorId: 1 });
analyticsEventSchema.index({ project: 1 });
analyticsEventSchema.index({ page: 1 });

export default mongoose.model("AnalyticsEvent", analyticsEventSchema);

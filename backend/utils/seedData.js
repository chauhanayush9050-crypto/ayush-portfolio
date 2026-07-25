// =====================================================
// Seed script — populates the database with Ayush's real
// starter content (projects, education, experience, admin user).
// This does NOT contain fake/dummy data — only what was
// confirmed in the project brief. Fields not yet provided
// (GitHub links, live URLs, images) are left as empty
// strings, clearly marked, for the admin to fill in later
// via the dashboard.
//
// Skills are intentionally NOT seeded — per instruction, skills
// must be added entirely through the admin dashboard, with no
// default/sample entries.
//
// All seeded projects/experience/education are created as DRAFTS
// (isPublished: false). Use the admin dashboard to publish them
// once you've reviewed the content.
//
// Run with: npm run seed
// Requires MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD in .env
// =====================================================

import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Settings from "../models/Settings.js";

dotenv.config();

const projects = [
  {
    title: "NexBank",
    shortDescription: "Full Stack Banking Application",
    fullDescription: "", // TODO(Ayush): add full project description
    thumbnail: { url: "", publicId: "" }, // TODO(Ayush): upload via admin panel
    banner: { url: "", publicId: "" }, // TODO(Ayush): upload via admin panel
    gallery: [], // TODO(Ayush): add gallery images via admin panel
    technologies: [], // TODO(Ayush): confirm tech stack used for this project
    features: [], // TODO(Ayush): add key features
    githubUrl: "", // TODO(Ayush): add GitHub repo link
    liveUrl: "", // TODO(Ayush): add live demo link if deployed
    category: "Full Stack",
    status: "In Progress",
    order: 1,
  },
  {
    title: "Gym Management System",
    shortDescription: "Salesforce Service Cloud Automation",
    fullDescription: "", // TODO(Ayush): add full project description
    thumbnail: { url: "", publicId: "" }, // TODO(Ayush): upload via admin panel
    banner: { url: "", publicId: "" }, // TODO(Ayush): upload via admin panel
    gallery: [], // TODO(Ayush): add gallery images via admin panel
    technologies: ["Salesforce", "Service Cloud", "Flow Builder"],
    features: [], // TODO(Ayush): add key features
    githubUrl: "",
    liveUrl: "",
    category: "Salesforce",
    status: "In Progress",
    order: 2,
  },
];

const aboutText =
  "I'm a JavaScript Developer and Salesforce Administrator who enjoys solving real problems through clean, " +
  "efficient code and well-configured CRM workflows. My work spans full-stack web development with the MERN " +
  "stack and hands-on Salesforce administration, including Flow Builder automation, validation rules, and " +
  "Service Cloud configuration. I care about writing maintainable code, understanding the business logic " +
  "behind every feature, and continuously learning new tools and best practices.";

const education = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Bhagwant Global University",
    period: "", // TODO(Ayush): add start/end years
    description: "",
  },
];

const experience = [
  {
    title: "Personal Projects & Hands-on Development",
    organization: "Self-directed",
    period: "", // TODO(Ayush): add timeframe
    description:
      "Building full-stack web applications end-to-end, from database design through deployment.",
    type: "Development",
  },
  {
    title: "Salesforce Administration Practice",
    organization: "Self-directed / training environment",
    period: "", // TODO(Ayush): add timeframe
    description:
      "Hands-on practice configuring Salesforce orgs: Flow Builder automations, validation rules, " +
      "reports & dashboards, Service Cloud setup, approval processes, permission sets, and user management.",
    type: "Salesforce",
  },
];

const seed = async () => {
  try {
    await connectDB();

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.error(
        "[seed] ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before seeding the admin user."
      );
      process.exit(1);
    }

    // Admin user (idempotent — won't duplicate on re-run)
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      await User.create({
        name: "Ayush Chauhan",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      });
      console.log("[seed] Admin user created");
    } else {
      console.log("[seed] Admin user already exists, skipping");
    }

    await Project.deleteMany();
    await Project.insertMany(projects);
    console.log("[seed] Projects seeded (as drafts — publish from the admin dashboard)");

    await Settings.findOneAndUpdate(
      {},
      { aboutText, education, experience },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(
      "[seed] Settings (about/education/experience) seeded (education & experience entries are drafts)"
    );

    console.log("[seed] Done.");
    process.exit(0);
  } catch (error) {
    console.error("[seed] Error:", error.message);
    process.exit(1);
  }
};

seed();

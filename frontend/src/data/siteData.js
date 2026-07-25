// =====================================================
// Fallback / seed-shaped data.
// The live site fetches everything from the backend API.
// This file exists purely so the frontend renders real,
// correct content (not lorem ipsum) if the API is briefly
// unreachable — e.g. during local development before
// Phase 3 (MongoDB Atlas) is connected.
//
// Every field below is either real content confirmed by
// Ayush, or an explicit placeholder marked with a comment
// for him to fill in later through the admin dashboard.
// =====================================================

export const profile = {
  name: "Ayush Chauhan",
  titles: ["JavaScript Developer", "Salesforce Administrator"],
  tagline:
    "I build fast, full-stack web applications and automate business workflows on Salesforce.",
  // TODO(Ayush): provide your real GitHub profile URL
  github: "https://github.com/YOUR-USERNAME",
  // TODO(Ayush): provide your real LinkedIn profile URL
  linkedin: "https://linkedin.com/in/YOUR-USERNAME",
  // TODO(Ayush): confirm the email address you want displayed publicly
  email: "your.email@example.com",
  // Resume is now managed entirely through the admin dashboard (Resume
  // Management module) and fetched live from GET /api/resume — no
  // static placeholder needed here.
};

export const aboutText =
  "I'm a JavaScript Developer and Salesforce Administrator who enjoys solving real problems through clean, " +
  "efficient code and well-configured CRM workflows. My work spans full-stack web development with the MERN " +
  "stack and hands-on Salesforce administration, including Flow Builder automation, validation rules, and " +
  "Service Cloud configuration. I care about writing maintainable code, understanding the business logic " +
  "behind every feature, and continuously learning new tools and best practices.";

// Skills are intentionally NOT hardcoded here — per instruction, skills
// must come entirely from the admin dashboard / MongoDB, with no
// default/sample entries, even as a fallback.
export const skills = {};

export const projects = [
  {
    _id: "nexbank",
    title: "NexBank",
    shortDescription: "Full Stack Banking Application",
    fullDescription: "", // TODO(Ayush): add a full project description
    thumbnail: { url: "", publicId: "" }, // TODO(Ayush): upload via admin panel
    banner: { url: "", publicId: "" }, // TODO(Ayush): upload via admin panel
    gallery: [], // TODO(Ayush): add gallery images via admin panel
    technologies: [], // TODO(Ayush): confirm the tech stack used
    features: [], // TODO(Ayush): add key features
    githubUrl: "",
    liveUrl: "",
    category: "Full Stack",
    status: "In Progress",
  },
  {
    _id: "gym-management-system",
    title: "Gym Management System",
    shortDescription: "Salesforce Service Cloud Automation",
    fullDescription: "", // TODO(Ayush): add a full project description
    thumbnail: { url: "", publicId: "" }, // TODO(Ayush): upload via admin panel
    banner: { url: "", publicId: "" }, // TODO(Ayush): upload via admin panel
    gallery: [], // TODO(Ayush): add gallery images via admin panel
    technologies: ["Salesforce", "Service Cloud", "Flow Builder"],
    features: [],
    githubUrl: "",
    liveUrl: "",
    category: "Salesforce",
    status: "In Progress",
  },
];

export const experience = [
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

export const education = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Bhagwant Global University",
    period: "", // TODO(Ayush): add start/end years
    description: "",
  },
];

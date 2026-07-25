// =====================================================
// Server entry point
// Wires together express, security middleware, routes,
// and the MongoDB connection.
// =====================================================

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

// -----------------------------------------------------
// NOTE: connectDB() will only succeed once a real
// MONGO_URI is provided in .env (Phase 3). Until then,
// the server still boots so the frontend can be built
// and reviewed against mock/local data.
// -----------------------------------------------------
connectDB();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// General request rate limiter for state-changing requests (tighter
// limiters are applied separately on auth/contact/analytics routes).
// GET requests are exempt: they're read-only, and a single normal page
// load legitimately fires many of them (public data fetches, section
// tracking, etc.) — throttling reads here caused normal browsing to hit
// 429s. Mutations (POST/PUT/DELETE/PATCH) remain protected.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "GET",
});
app.use(globalLimiter);

// Body parsing & logging
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Static folder for locally-stored uploads (fallback if Cloudinary isn't configured yet)
app.use("/uploads", express.static("uploads"));

// -----------------------------------------------------
// API Routes
// -----------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Ayush Chauhan Portfolio API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);

// 404 + error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

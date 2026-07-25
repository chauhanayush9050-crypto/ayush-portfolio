// =====================================================
// Stricter rate limiter for sensitive endpoints
// (login, contact form) to prevent brute-force / spam
// =====================================================

import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    message: "Too many messages sent. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Analytics events fire much more often than form submissions (every
// section scroll, every click), so this allows a generous rate while
// still guarding against abuse/scripted flooding.
export const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: {
    success: false,
    message: "Too many analytics events. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

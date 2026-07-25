// =====================================================
// JWT token generator
// PHASE 3 NOTE: requires JWT_SECRET in .env
// =====================================================

import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export default generateToken;

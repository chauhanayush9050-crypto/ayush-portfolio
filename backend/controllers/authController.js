// =====================================================
// Auth controller — admin login & password management
// =====================================================

import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Login admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // [AUTH DEBUG] --- temporary, remove after root cause is identified ---
  console.log("[AUTH DEBUG] --- new login attempt ---");
  console.log("[AUTH DEBUG] content-type header:", req.headers["content-type"]);
  console.log("[AUTH DEBUG] email received:", JSON.stringify(email));
  console.log("[AUTH DEBUG] password length received:", password ? password.length : 0);
  console.log("[AUTH DEBUG] mongoose connection db name:", User.db.name);
  console.log("[AUTH DEBUG] mongoose connection readyState:", User.db.readyState);
  // [AUTH DEBUG] --- end block ---

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  // [AUTH DEBUG] --- temporary, remove after root cause is identified ---
  console.log("[AUTH DEBUG] User.findOne() returned a user:", !!user);
  if (user) {
    console.log("[AUTH DEBUG] found user _id:", user._id.toString());
    console.log("[AUTH DEBUG] found user email (as stored in DB):", JSON.stringify(user.email));
    console.log(
      "[AUTH DEBUG] found user email char codes:",
      Array.from(user.email).map((c) => c.charCodeAt(0))
    );
    console.log("[AUTH DEBUG] stored password hash prefix:", user.password ? user.password.slice(0, 7) : null);
    console.log("[AUTH DEBUG] stored password hash length:", user.password ? user.password.length : 0);
  } else {
    const totalUsers = await User.countDocuments();
    console.log("[AUTH DEBUG] total User documents visible on this connection:", totalUsers);
    const allUsers = await User.find().select("email");
    console.log(
      "[AUTH DEBUG] all emails visible on this connection:",
      allUsers.map((u) => JSON.stringify(u.email))
    );
  }
  // [AUTH DEBUG] --- end block ---

  const passwordMatches = user ? await user.matchPassword(password) : false;

  // [AUTH DEBUG] --- temporary, remove after root cause is identified ---
  console.log("[AUTH DEBUG] bcrypt.compare (matchPassword) result:", passwordMatches);
  // [AUTH DEBUG] --- end block ---

  if (!user || !passwordMatches) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get currently logged in admin profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @desc    Change admin password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user || !(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  if (!newPassword || newPassword.length < 8) {
    res.status(400);
    throw new Error("New password must be at least 8 characters");
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
});

export { loginAdmin, getMe, changePassword };

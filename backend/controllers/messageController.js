// =====================================================
// Message controller — contact form submission + admin inbox
// =====================================================

import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";
import Settings from "../models/Settings.js";
import sendEmail from "../utils/sendEmail.js";

// @desc    Submit contact form (public)
// @route   POST /api/messages
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  const savedMessage = await Message.create({ name, email, subject, message });

  // Confirmation email to the visitor
  sendEmail({
    to: email,
    subject: "Thanks for reaching out to Ayush Chauhan",
    html: `<p>Hi ${name},</p><p>Thanks for your message — I'll get back to you soon.</p><p>Your message:</p><blockquote>${message}</blockquote>`,
  }).catch((err) => console.error("[email] visitor confirmation failed:", err.message));

  // Notification email to admin
  const settings = await Settings.findOne();
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || settings?.profile?.email;

  if (adminEmail) {
    sendEmail({
      to: adminEmail,
      subject: `New portfolio contact form message: ${subject}`,
      html: `<p>From: ${name} (${email})</p><p>${message}</p>`,
    }).catch((err) => console.error("[email] admin notification failed:", err.message));
  }

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: savedMessage,
  });
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ success: true, count: messages.length, data: messages });
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
const markAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  message.isRead = true;
  await message.save();

  res.json({ success: true, data: message });
});

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  await message.deleteOne();
  res.json({ success: true, message: "Message deleted" });
});

export { createMessage, getMessages, markAsRead, deleteMessage };

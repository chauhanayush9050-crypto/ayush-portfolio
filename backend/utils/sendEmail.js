// =====================================================
// Nodemailer email utility
// PHASE 3 NOTE: requires SMTP_HOST, SMTP_PORT, SMTP_EMAIL,
// SMTP_PASSWORD in .env. Until then, emails are logged to
// the console instead of actually being sent, so the rest
// of the app can be developed and tested.
// =====================================================

import nodemailer from "nodemailer";

const hasSmtpConfig =
  process.env.SMTP_HOST && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD;

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Send an email.
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!hasSmtpConfig) {
    console.warn(
      `[email] SMTP not configured yet. Skipping real send.\n` +
        `[email] Would have sent to: ${to}\n[email] Subject: ${subject}`
    );
    return { simulated: true };
  }

  const transporter = getTransporter();

  const info = await transporter.sendMail({
    from: `"Ayush Chauhan Portfolio" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });

  return info;
};

export default sendEmail;

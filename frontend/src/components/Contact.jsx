import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";
import SectionReveal from "./SectionReveal.jsx";
import SocialIcons from "./SocialIcons.jsx";
import api from "../services/api.js";
import useSiteSettings from "../hooks/useSiteSettings.js";
import { SOCIAL_PLATFORMS } from "../config/socialPlatforms.js";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const { settings } = useSiteSettings();

  const email = settings?.profile?.email || "";
  const phone = settings?.profile?.phone || "";
  const location = settings?.profile?.location || "";
  const socialLinks = settings?.socialLinks || null;
  const hasSocialLinks = socialLinks && SOCIAL_PLATFORMS.some((p) => socialLinks[p.key]?.trim());

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }
    if (!form.subject.trim()) next.subject = "Subject is required";
    if (!form.message.trim()) next.message = "Message is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      await api.post("/messages", form);
      setStatus("success");
      setForm(initialForm);
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36">
      <div className="section-container">
        <SectionReveal>
          <p className="section-eyebrow mb-3">Contact</p>
          <h2 className="section-heading mb-14 max-w-2xl">Let's build something together.</h2>
        </SectionReveal>

        <div className="grid lg:grid-cols-5 gap-10">
          <SectionReveal delay={0.1} className="lg:col-span-2 space-y-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="glass-card p-5 flex items-center gap-4 hover:border-accent/40"
              >
                <span className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent-light">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="text-xs text-white/40">Email</p>
                  <p className="text-sm font-medium">{email}</p>
                </div>
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="glass-card p-5 flex items-center gap-4 hover:border-accent/40"
              >
                <span className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent-light">
                  <Phone size={18} />
                </span>
                <div>
                  <p className="text-xs text-white/40">Phone</p>
                  <p className="text-sm font-medium">{phone}</p>
                </div>
              </a>
            )}
            {location && (
              <div className="glass-card p-5 flex items-center gap-4">
                <span className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent-light">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-xs text-white/40">Location</p>
                  <p className="text-sm font-medium">{location}</p>
                </div>
              </div>
            )}
            {hasSocialLinks && (
              <div className="glass-card p-5">
                <p className="text-xs text-white/40 mb-3">Connect</p>
                <div className="flex flex-wrap items-center gap-3">
                  <SocialIcons
                    socialLinks={socialLinks}
                    className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-accent-light hover:bg-white/10 transition-colors"
                  />
                </div>
              </div>
            )}
            {!email && !phone && !location && !hasSocialLinks && (
              <div className="glass-card p-5 text-sm text-white/40">
                {/* Contact details are managed from the admin dashboard — none added yet */}
                Contact details coming soon.
              </div>
            )}
          </SectionReveal>

          <SectionReveal delay={0.2} className="lg:col-span-3">
            <form onSubmit={handleSubmit} noValidate className="glass-card p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="What's this about?"
                />
                {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
                {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary w-full sm:w-auto disabled:opacity-60"
              >
                {status === "submitting" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                Send Message
              </button>

              {status === "error" && (
                <p className="text-sm text-red-400">
                  Something went wrong sending your message. Please try again shortly.
                </p>
              )}

              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 text-emerald-400 text-sm"
                  >
                    <CheckCircle2 size={18} />
                    Message sent! I'll get back to you soon.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

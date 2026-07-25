import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowDown, Download, Send } from "lucide-react";
import { profile } from "../data/siteData.js";
import useApiData from "../hooks/useApiData.js";
import useSiteSettings from "../hooks/useSiteSettings.js";
import SocialIcons from "./SocialIcons.jsx";
import ImageLightbox from "./ImageLightbox.jsx";
import { trackResumeDownload, trackContactClick } from "../services/analytics.js";

// Simple typewriter effect cycling through the two titles
function useTypewriter(words, speed = 90, pause = 1400) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), speed);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), speed / 2);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setWordIndex((i) => i + 1);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, speed, pause]);

  return text;
}

export default function Hero() {
  const { data: resume } = useApiData("/resume", null);
  const resumeUrl = resume?.fileUrl || "";
  const { settings } = useSiteSettings();
  const email = settings?.profile?.email || "";
  const profilePhoto = settings?.images?.profilePhoto || "";
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Drive Hero content from Profile settings; fall back to the existing
  // static content (siteData.js) until real values are set via the CMS.
  const heroName = settings?.profile?.fullName?.trim() || profile.name;
  const heroBio = settings?.profile?.bio?.trim() || profile.tagline;
  const headline = settings?.profile?.headline?.trim();
  // Typewriter still animates the same way — a single saved headline just
  // becomes the one "word" it types/deletes instead of rotating two roles.
  const titles = useMemo(() => (headline ? [headline] : profile.titles), [headline]);
  const typed = useTypewriter(titles);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20"
    >
      {/* Background: grid + floating blobs */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-accent-light/10 blur-3xl animate-blob [animation-delay:4s]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl animate-blob [animation-delay:2s]" />

      {/* Particles (lightweight, CSS-based) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/30 animate-float"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              animationDelay: `${(i % 6) * 0.8}s`,
              animationDuration: `${6 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="section-container relative z-10 w-full">
        {profilePhoto && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            onClick={() => setLightboxOpen(true)}
            className="mb-6 h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden ring-2 ring-accent/40 shadow-glow hover:ring-accent transition-all"
            aria-label="View profile photo"
          >
            <img src={profilePhoto} alt={heroName} className="h-full w-full object-cover" />
          </motion.button>
        )}

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-eyebrow mb-6"
        >
          Available for new opportunities
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05]"
        >
          {heroName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 h-10 sm:h-12"
        >
          <span className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-accent-light">
            {typed}
            <span className="inline-block w-[3px] h-7 sm:h-8 bg-accent-light ml-1 align-middle animate-pulse" />
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 max-w-xl text-lg text-white/60 leading-relaxed"
        >
          {heroBio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary"
          >
            View Projects
          </button>
          <a
            href={resumeUrl || "#"}
            download
            onClick={() => resumeUrl && trackResumeDownload()}
            className={`btn-secondary ${!resumeUrl ? "opacity-50 pointer-events-none" : ""}`}
            title={!resumeUrl ? "Resume not uploaded yet" : "Download Resume"}
          >
            <Download size={18} />
            Download Resume
          </a>
          <button
            onClick={() => {
              trackContactClick();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-secondary"
          >
            <Send size={18} />
            Contact Me
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 flex items-center gap-5"
        >
          {settings?.socialLinks && (
            <SocialIcons
              socialLinks={settings.socialLinks}
              className="text-white/50 hover:text-accent-light transition-colors"
            />
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-white/50 hover:text-accent-light transition-colors"
              aria-label="Email"
              title="Email"
            >
              <Mail size={22} />
            </a>
          )}
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white transition-colors"
        aria-label="Scroll down"
      >
        <ArrowDown size={22} />
      </motion.button>

      {profilePhoto && (
        <ImageLightbox
          src={profilePhoto}
          alt={heroName}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}

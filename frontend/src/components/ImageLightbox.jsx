import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Fullscreen image preview. Closes on backdrop click or ESC.
 * Reuses the same AnimatePresence/opacity-fade pattern as LoadingScreen.jsx
 * for visual consistency — no new dependency, no third-party lightbox lib.
 */
export default function ImageLightbox({ src, alt = "", open, onClose }) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm p-6"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="absolute top-5 right-5 h-10 w-10 rounded-full glass flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-colors"
          >
            <X size={20} />
          </button>
          <motion.img
            src={src}
            alt={alt}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-card"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

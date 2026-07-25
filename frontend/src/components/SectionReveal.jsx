import { motion } from "framer-motion";

/**
 * Wraps children in a Framer Motion scroll-triggered fade/slide reveal.
 * Keeps animation logic in one place instead of repeating variants
 * across every section.
 */
export default function SectionReveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  as: Component = "div",
}) {
  const MotionComponent = motion[Component] || motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

import { useEffect, useRef } from "react";
import { trackPageView } from "../services/analytics.js";

/**
 * Observes each section id and fires a "pageview" analytics event the
 * first time it becomes meaningfully visible (≥40% in viewport). Each
 * section only ever fires once per page load, so re-scrolling past a
 * section repeatedly doesn't inflate the numbers.
 */
export default function useSectionTracking(sectionIds) {
  const firedRef = useRef(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && !firedRef.current.has(id)) {
            firedRef.current.add(id);
            trackPageView(id);
          }
        });
      },
      { threshold: 0.4 }
    );

    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);
}

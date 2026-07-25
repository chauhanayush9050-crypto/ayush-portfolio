// =====================================================
// Client-side analytics service
//
// Generates/reads an anonymous visitorId stored in the browser's
// own localStorage (not tied to any personal information — just a
// random identifier used to count unique visitors). Every tracking
// call is fire-and-forget: it never blocks the UI and silently
// swallows errors, so analytics can never slow down or break the
// portfolio experience.
// =====================================================

import api from "./api.js";

const VISITOR_ID_KEY = "portfolio_visitor_id";

const getOrCreateVisitorId = () => {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (privacy mode, etc.) — fall back to a
    // per-session id so tracking still works, just without persistence.
    return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
};

/**
 * Fire-and-forget analytics event. Never throws, never awaited by callers.
 */
const track = (type, extra = {}) => {
  const visitorId = getOrCreateVisitorId();
  api
    .post("/analytics/track", {
      type,
      visitorId,
      referrer: typeof document !== "undefined" ? document.referrer : "",
      ...extra,
    })
    .catch(() => {
      // Analytics failures are deliberately silent — never surface to the user.
    });
};

export const trackPageView = (page) => track("pageview", { page });
export const trackProjectView = (projectId) => track("project_view", { projectId });
export const trackResumeDownload = () => track("resume_download");
export const trackGithubClick = () => track("github_click");
export const trackLinkedinClick = () => track("linkedin_click");
export const trackContactClick = () => track("contact_click");

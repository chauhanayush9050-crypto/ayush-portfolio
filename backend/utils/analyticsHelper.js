// =====================================================
// Analytics enrichment helper
//
// Derives non-sensitive visitor context from the request:
//   - country/city via geoip-lite (offline database, no API key,
//     no external network call — the IP is used only in-memory
//     here and is never written to the database)
//   - device type / browser / OS via ua-parser-js (parses the
//     User-Agent header, no external call)
//   - referrer source via the Referer header, categorized into
//     a small set of known sources
// =====================================================

import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

const KNOWN_REFERRER_PATTERNS = [
  { pattern: /google\./i, label: "Google" },
  { pattern: /linkedin\./i, label: "LinkedIn" },
  { pattern: /github\./i, label: "GitHub" },
  { pattern: /bing\./i, label: "Bing" },
  { pattern: /duckduckgo\./i, label: "DuckDuckGo" },
  { pattern: /twitter\.|x\.com/i, label: "Twitter / X" },
  { pattern: /facebook\./i, label: "Facebook" },
  { pattern: /instagram\./i, label: "Instagram" },
];

const getClientIp = (req) => {
  // Render (and most proxies) set x-forwarded-for; fall back to the
  // direct socket address for local development.
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || req.ip || "";
};

const categorizeReferrer = (referrer) => {
  if (!referrer) return "Direct";

  const match = KNOWN_REFERRER_PATTERNS.find((r) => r.pattern.test(referrer));
  if (match) return match.label;

  try {
    const hostname = new URL(referrer).hostname;
    return hostname || "Other";
  } catch {
    return "Other";
  }
};

const mapDeviceType = (uaDeviceType) => {
  if (uaDeviceType === "mobile") return "Mobile";
  if (uaDeviceType === "tablet") return "Tablet";
  if (!uaDeviceType) return "Desktop"; // ua-parser leaves this undefined for desktop
  return "Unknown";
};

/**
 * Builds the non-sensitive analytics context for the current request.
 * The client IP is read here only to perform an in-memory geo lookup;
 * it is deliberately not included in the returned object and is never
 * persisted anywhere.
 */
export const getAnalyticsContext = (req) => {
  const ip = getClientIp(req);
  const geo = ip ? geoip.lookup(ip) : null;

  const parser = new UAParser(req.headers["user-agent"] || "");
  const uaResult = parser.getResult();

  return {
    country: geo?.country || "",
    city: geo?.city || "",
    deviceType: mapDeviceType(uaResult.device?.type),
    browser: uaResult.browser?.name || "",
    os: uaResult.os?.name || "",
    referrerSource: categorizeReferrer(req.headers["referer"] || req.body?.referrer || ""),
  };
};

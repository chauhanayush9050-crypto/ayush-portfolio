// =====================================================
// Shared social platform config — single source of truth
// for every platform the Profile/Settings module supports.
// Used by both the admin Social Links form and the public
// SocialIcons component, so adding a platform only ever
// happens in one place.
//
// Lucide doesn't ship brand icons for every coding platform
// (LeetCode, HackerRank, CodeChef, Codeforces, GeeksforGeeks,
// Dev.to, Medium), so those fall back to a generic Link2 icon
// with the platform name as the accessible label/tooltip.
// =====================================================

import {
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Link2,
} from "lucide-react";

export const SOCIAL_PLATFORMS = [
  { key: "github", label: "GitHub", icon: Github },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "twitter", label: "Twitter / X", icon: Twitter },
  { key: "youtube", label: "YouTube", icon: Youtube },
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "medium", label: "Medium", icon: Link2 },
  { key: "devto", label: "Dev.to", icon: Link2 },
  { key: "leetcode", label: "LeetCode", icon: Link2 },
  { key: "hackerrank", label: "HackerRank", icon: Link2 },
  { key: "codechef", label: "CodeChef", icon: Link2 },
  { key: "codeforces", label: "Codeforces", icon: Link2 },
  { key: "geeksforgeeks", label: "GeeksforGeeks", icon: Link2 },
];

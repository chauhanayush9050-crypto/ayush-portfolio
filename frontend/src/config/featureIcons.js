// =====================================================
// Icon library for About feature cards.
// Every icon here is one already imported and used somewhere
// else in this project (lucide-react is the icon set used
// throughout) — the admin picks a name from this list, and the
// public About section resolves that name back to the same
// icon component. Single source of truth for both.
// =====================================================

import {
  Code2,
  Server,
  Cloud,
  Puzzle,
  GraduationCap,
  Layers,
  Wrench,
  Users,
  FileText,
  Lock,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

export const FEATURE_ICONS = {
  Code2,
  Server,
  Cloud,
  Puzzle,
  GraduationCap,
  Layers,
  Wrench,
  Users,
  FileText,
  Lock,
  CheckCircle2,
  MessageSquare,
};

export const FEATURE_ICON_NAMES = Object.keys(FEATURE_ICONS);

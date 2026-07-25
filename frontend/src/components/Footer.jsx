import { Mail } from "lucide-react";
import BackToTop from "./BackToTop.jsx";
import SocialIcons from "./SocialIcons.jsx";
import useSiteSettings from "../hooks/useSiteSettings.js";
import { profile } from "../data/siteData.js";

export default function Footer() {
  const { settings } = useSiteSettings();
  const copyrightText =
    settings?.portfolioSettings?.copyrightText ||
    `© ${new Date().getFullYear()} ${profile.name}. All rights reserved.`;

  return (
    <footer className="relative border-t border-white/10 py-10">
      <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-sm text-white/40">{copyrightText}</p>

        <div className="flex items-center gap-5">
          {settings?.profile?.email && (
            <a
              href={`mailto:${settings.profile.email}`}
              className="text-white/40 hover:text-accent-light transition-colors"
              aria-label="Email"
              title="Email"
            >
              <Mail size={18} />
            </a>
          )}
          {settings?.socialLinks ? (
            <SocialIcons
              socialLinks={settings.socialLinks}
              className="text-white/40 hover:text-accent-light transition-colors"
            />
          ) : null}
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}

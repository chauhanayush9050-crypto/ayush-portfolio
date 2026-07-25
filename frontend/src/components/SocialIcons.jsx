import { SOCIAL_PLATFORMS } from "../config/socialPlatforms.js";
import { trackGithubClick, trackLinkedinClick } from "../services/analytics.js";

const CLICK_TRACKERS = {
  github: trackGithubClick,
  linkedin: trackLinkedinClick,
};

/**
 * Renders one icon per platform in `socialLinks` that has a non-empty URL.
 * Platforms with no URL are simply not rendered — no placeholders,
 * no broken links, no empty icons.
 */
export default function SocialIcons({ socialLinks, className = "" }) {
  if (!socialLinks) return null;

  const active = SOCIAL_PLATFORMS.filter((p) => socialLinks[p.key]?.trim());

  if (active.length === 0) return null;

  return (
    <>
      {active.map(({ key, label, icon: Icon }) => (
        <a
          key={key}
          href={socialLinks[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          onClick={() => CLICK_TRACKERS[key]?.()}
          className={className}
        >
          <Icon size={20} />
        </a>
      ))}
    </>
  );
}

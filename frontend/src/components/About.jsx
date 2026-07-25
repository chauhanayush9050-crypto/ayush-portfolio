import SectionReveal from "./SectionReveal.jsx";
import useApiData from "../hooks/useApiData.js";
import { aboutText as fallbackAbout } from "../data/siteData.js";
import { FEATURE_ICONS } from "../config/featureIcons.js";

export default function About() {
  const { data } = useApiData("/about", { aboutText: fallbackAbout });
  const aboutText = data?.aboutText || fallbackAbout;
  const { data: featureCards } = useApiData("/about/feature-cards", []);

  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="section-container">
        <SectionReveal>
          <p className="section-eyebrow mb-3">About</p>
          <h2 className="section-heading mb-10 max-w-2xl">Building things with purpose.</h2>
        </SectionReveal>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <SectionReveal delay={0.1} className="lg:col-span-3">
            <p className="text-lg text-white/70 leading-relaxed">{aboutText}</p>
          </SectionReveal>

          <SectionReveal delay={0.2} className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featureCards.map(({ _id, icon, title }) => {
                const Icon = FEATURE_ICONS[icon];
                if (!Icon) return null;
                return (
                  <div
                    key={_id}
                    className="glass-card p-5 flex items-center gap-3 hover:border-accent/40 hover:-translate-y-1"
                  >
                    <div className="shrink-0 h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Icon size={20} className="text-accent-light" />
                    </div>
                    <span className="text-sm font-medium text-white/80">{title}</span>
                  </div>
                );
              })}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

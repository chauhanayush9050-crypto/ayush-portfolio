import { Code2, Cloud } from "lucide-react";
import SectionReveal from "./SectionReveal.jsx";
import useApiData from "../hooks/useApiData.js";
import { experience as fallbackExperience } from "../data/siteData.js";

const TYPE_ICON = {
  Development: Code2,
  Salesforce: Cloud,
  Other: Code2,
};

export default function Experience() {
  const { data: experience } = useApiData("/experience", fallbackExperience);

  return (
    <section id="experience" className="relative py-28 sm:py-36 bg-secondary/40">
      <div className="section-container">
        <SectionReveal>
          <p className="section-eyebrow mb-3">Experience</p>
          <h2 className="section-heading mb-14 max-w-2xl">Hands-on, self-directed growth.</h2>
        </SectionReveal>

        <div className="relative border-l border-white/10 ml-3 space-y-10">
          {experience.map((item, idx) => {
            const Icon = TYPE_ICON[item.type] || Code2;
            return (
              <SectionReveal key={idx} delay={idx * 0.1} className="relative pl-10">
                <span className="absolute -left-[21px] top-1 h-10 w-10 rounded-full glass flex items-center justify-center text-accent-light">
                  <Icon size={18} />
                </span>
                <div className="glass-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                    {item.period && (
                      <span className="badge">{item.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-accent-light mb-3">{item.organization}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

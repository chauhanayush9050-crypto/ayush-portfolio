import { GraduationCap } from "lucide-react";
import SectionReveal from "./SectionReveal.jsx";
import useApiData from "../hooks/useApiData.js";
import { education as fallbackEducation } from "../data/siteData.js";

export default function Education() {
  const { data: education } = useApiData("/education", fallbackEducation);

  return (
    <section id="education" className="relative py-28 sm:py-36">
      <div className="section-container">
        <SectionReveal>
          <p className="section-eyebrow mb-3">Education</p>
          <h2 className="section-heading mb-14 max-w-2xl">Academic foundation.</h2>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {education.map((item, idx) => (
            <SectionReveal key={idx} delay={idx * 0.1}>
              <div className="glass-card p-8 h-full hover:border-accent/40 hover:-translate-y-1">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 text-accent-light">
                  <GraduationCap size={24} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{item.degree}</h3>
                <p className="text-accent-light text-sm mb-1">{item.institution}</p>
                {item.period ? (
                  <p className="text-white/40 text-sm mb-3">{item.period}</p>
                ) : (
                  <p className="text-white/30 text-xs mb-3 italic">
                    {/* TODO(Ayush): add start/end years via the admin panel */}
                    Dates to be added
                  </p>
                )}
                {item.description && (
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                )}
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

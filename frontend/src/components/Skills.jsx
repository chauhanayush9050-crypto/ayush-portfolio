import { Code2, Server, Cloud, Wrench, Layers } from "lucide-react";
import SectionReveal from "./SectionReveal.jsx";
import useApiData from "../hooks/useApiData.js";
import { skills as fallbackSkills } from "../data/siteData.js";

const CATEGORY_META = {
  Frontend: { icon: Code2, color: "text-sky-400" },
  Backend: { icon: Server, color: "text-emerald-400" },
  Salesforce: { icon: Cloud, color: "text-accent-light" },
  Tools: { icon: Wrench, color: "text-amber-400" },
};

export default function Skills() {
  const { data } = useApiData("/skills", null);

  // API returns a flat array of { name, category, icon }; fallback data is
  // pre-grouped by category. Normalize both into the same shape.
  const grouped = data
    ? data.reduce((acc, skill) => {
        acc[skill.category] = acc[skill.category] || [];
        acc[skill.category].push(skill);
        return acc;
      }, {})
    : fallbackSkills;

  const categories = Object.keys(CATEGORY_META).filter((c) => grouped[c]?.length);

  return (
    <section id="skills" className="relative py-28 sm:py-36 bg-secondary/40">
      <div className="section-container">
        <SectionReveal>
          <p className="section-eyebrow mb-3">Skills</p>
          <h2 className="section-heading mb-14 max-w-2xl">
            A toolkit spanning code and CRM.
          </h2>
        </SectionReveal>

        {categories.length === 0 ? (
          <SectionReveal delay={0.1}>
            <div className="glass-card p-12 text-center max-w-xl mx-auto">
              <Layers size={32} className="mx-auto mb-4 text-white/30" />
              <p className="text-white/50">
                {/* Skills are managed from the admin dashboard — none published yet */}
                No skills published yet. They'll appear here automatically once added and
                published from the admin dashboard.
              </p>
            </div>
          </SectionReveal>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => {
              const { icon: Icon, color } = CATEGORY_META[category];
              return (
                <SectionReveal key={category} delay={idx * 0.08}>
                  <div className="glass-card p-6 h-full hover:border-accent/40 hover:-translate-y-1">
                    <div className={`h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center mb-5 ${color}`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-4">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {grouped[category].map((skill) => (
                        <span key={skill.name || skill} className="badge inline-flex items-center gap-1.5">
                          {skill.icon && (
                            <img src={skill.icon} alt="" className="h-3.5 w-3.5 rounded-sm object-contain" />
                          )}
                          {skill.name || skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

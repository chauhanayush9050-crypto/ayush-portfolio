import SectionReveal from "./SectionReveal.jsx";
import ProjectCard from "./ProjectCard.jsx";
import useApiData from "../hooks/useApiData.js";
import { projects as fallbackProjects } from "../data/siteData.js";

export default function Projects() {
  const { data: projects } = useApiData("/projects", fallbackProjects);

  return (
    <section id="projects" className="relative py-28 sm:py-36">
      <div className="section-container">
        <SectionReveal>
          <p className="section-eyebrow mb-3">Projects</p>
          <h2 className="section-heading mb-14 max-w-2xl">
            Things I've built, end to end.
          </h2>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard key={project._id} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

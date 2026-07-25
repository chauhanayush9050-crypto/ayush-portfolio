import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import useApiData from "../hooks/useApiData.js";
import useDocumentHead from "../hooks/useDocumentHead.js";
import { projects as fallbackProjects } from "../data/siteData.js";
import SectionReveal from "../components/SectionReveal.jsx";
import ProjectGallery from "../components/ProjectGallery.jsx";
import { trackProjectView } from "../services/analytics.js";

export default function ProjectDetails() {
  const { id } = useParams();
  const { data: projects, loading } = useApiData("/projects", fallbackProjects);

  const project = projects.find((p) => p._id === id);

  useDocumentHead({
    title: project ? `${project.title} | Ayush Chauhan` : "Project | Ayush Chauhan",
    description: project?.shortDescription,
  });

  useEffect(() => {
    // Only track against real MongoDB ObjectIds — the local fallback data
    // (used before Phase 3 / when the API is unreachable) uses slug-style
    // ids that aren't valid analytics subjects.
    if (project?._id && /^[0-9a-fA-F]{24}$/.test(project._id)) {
      trackProjectView(project._id);
    }
  }, [project?._id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white/50">Loading…</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="font-display text-3xl">Project not found</h1>
        <Link to="/#projects" className="btn-primary">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <>
      <article className="pt-32 pb-24 section-container">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <SectionReveal>
          <p className="section-eyebrow mb-3">{project.category}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">{project.title}</h1>
          <p className="text-lg text-white/60 max-w-2xl mb-8">{project.shortDescription}</p>

          <div className="flex flex-wrap gap-3 mb-10">
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <Github size={18} />
                View Code
              </a>
            ) : (
              <span className="btn-secondary opacity-40 cursor-not-allowed" title="GitHub link not added yet">
                <Github size={18} />
                View Code
              </span>
            )}
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <ExternalLink size={18} />
                Live Demo
              </a>
            ) : (
              <span className="btn-primary opacity-40 cursor-not-allowed" title="Live demo not deployed yet">
                <ExternalLink size={18} />
                Live Demo
              </span>
            )}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <ProjectGallery project={project} />
        </SectionReveal>

        <div className="grid lg:grid-cols-3 gap-10">
          <SectionReveal delay={0.15} className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-white/60 leading-relaxed">
                {project.fullDescription || (
                  <span className="italic text-white/30">
                    {/* TODO(Ayush): add a full project description via the admin panel */}
                    Full description coming soon.
                  </span>
                )}
              </p>
            </div>

            {project.features?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">Features</h2>
                <ul className="space-y-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-white/60">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.challenges && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">Challenges</h2>
                <p className="text-white/60 leading-relaxed">{project.challenges}</p>
              </div>
            )}

            {project.solutions && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">Solutions</h2>
                <p className="text-white/60 leading-relaxed">{project.solutions}</p>
              </div>
            )}
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="glass-card p-6 sticky top-28">
              <h3 className="font-display text-lg font-semibold mb-4">Technology Stack</h3>
              {project.technologies?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span key={t} className="badge">
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-white/30 text-sm italic">
                  {/* TODO(Ayush): confirm tech stack via the admin panel */}
                  Tech stack to be confirmed
                </p>
              )}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/40 mb-1">Status</p>
                <p className="text-sm font-medium">{project.status}</p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </article>
    </>
  );
}

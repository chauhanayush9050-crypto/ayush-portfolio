import { motion } from "framer-motion";
import { Github, ExternalLink, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project, index = 0 }) {
  const { _id, title, shortDescription, thumbnail, technologies, githubUrl, liveUrl, status } = project;
  const thumbnailUrl = thumbnail?.url || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card overflow-hidden group hover:border-accent/40"
    >
      <Link to={`/projects/${_id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            // TODO(Ayush): upload a real project screenshot via the admin panel
            <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-white/30">
              <ImageOff size={28} />
              <span className="text-xs font-mono">Screenshot coming soon</span>
            </div>
          )}
          <span className="absolute top-3 right-3 badge bg-background/70">{status}</span>
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/projects/${_id}`}>
          <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-accent-light transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-white/60 text-sm mb-4">{shortDescription}</p>

        {technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {technologies.map((tech) => (
              <span key={tech} className="badge">
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !py-2 !px-4 text-sm"
            >
              <Github size={16} />
              Code
            </a>
          ) : (
            <span
              className="btn-secondary !py-2 !px-4 text-sm opacity-40 cursor-not-allowed"
              title="GitHub link not added yet"
            >
              <Github size={16} />
              Code
            </span>
          )}
          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-2 !px-4 text-sm"
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          ) : (
            <span
              className="btn-primary !py-2 !px-4 text-sm opacity-40 cursor-not-allowed"
              title="Live demo not deployed yet"
            >
              <ExternalLink size={16} />
              Live Demo
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

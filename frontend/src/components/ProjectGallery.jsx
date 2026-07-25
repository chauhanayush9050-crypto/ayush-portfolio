import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

/**
 * Displays a project's banner + gallery images as a simple carousel:
 * a large main image with prev/next controls, plus a thumbnail strip
 * for jumping directly to any image. Falls back to the thumbnail
 * image, then to an empty state, if no banner/gallery images exist.
 */
export default function ProjectGallery({ project }) {
  const slides = [
    ...(project.banner?.url ? [{ url: project.banner.url, key: "banner" }] : []),
    ...(project.gallery || []).map((img) => ({ url: img.url, key: img._id || img.url })),
  ];

  const [index, setIndex] = useState(0);

  if (slides.length === 0) {
    // No banner/gallery yet — fall back to the thumbnail, else an empty state
    if (project.thumbnail?.url) {
      return (
        <div className="relative aspect-video rounded-2xl overflow-hidden glass mb-14">
          <img src={project.thumbnail.url} alt={project.title} className="h-full w-full object-cover" />
        </div>
      );
    }
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden glass mb-14">
        <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-white/30">
          <ImageOff size={32} />
          {/* TODO(Ayush): upload a banner or gallery images via the admin panel */}
          <span className="text-sm font-mono">Images coming soon</span>
        </div>
      </div>
    );
  }

  const goPrev = () => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div className="mb-14">
      <div className="relative aspect-video rounded-2xl overflow-hidden glass">
        <img
          src={slides[index].url}
          alt={`${project.title} — image ${index + 1}`}
          className="h-full w-full object-cover"
        />

        {slides.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 badge bg-background/70">
              {index + 1} / {slides.length}
            </span>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              onClick={() => setIndex(i)}
              className={`shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-colors ${
                i === index ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={slide.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

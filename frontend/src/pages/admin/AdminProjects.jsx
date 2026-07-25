import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Pencil, X, Upload, Loader2, ImageOff } from "lucide-react";
import api from "../../services/api.js";

const emptyProject = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  category: "Full Stack",
  status: "In Progress",
  isPublished: false,
};

const emptyImages = { thumbnail: null, banner: null, gallery: [] };

// Uploads shouldn't accidentally send a stray boundary-less Content-Type —
// see the note further down for why this must stay `undefined`.
const uploadHeaders = { headers: { "Content-Type": undefined } };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // "new" | project._id | null
  const [form, setForm] = useState(emptyProject);
  const [images, setImages] = useState(emptyImages); // current thumbnail/banner/gallery for the project being edited
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null); // "thumbnail" | "banner" | "gallery" | null

  const thumbnailInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const load = () => {
    setLoading(true);
    api
      .get("/projects/admin")
      .then((res) => setProjects(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditing("new");
    setForm(emptyProject);
    setImages(emptyImages);
  };

  const openEdit = (project) => {
    setEditing(project._id);
    setForm({
      title: project.title,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription || "",
      technologies: (project.technologies || []).join(", "),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      category: project.category,
      status: project.status,
      isPublished: project.isPublished,
    });
    setImages({
      thumbnail: project.thumbnail?.url ? project.thumbnail : null,
      banner: project.banner?.url ? project.banner : null,
      gallery: project.gallery || [],
    });
  };

  const closeForm = () => {
    setEditing(null);
    setImages(emptyImages);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      technologies: form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editing === "new") {
        const res = await api.post("/projects", payload);
        // Switch straight into editing the newly created project so the
        // admin can immediately manage its thumbnail/banner/gallery —
        // those need a real project id and can't be uploaded beforehand.
        const created = res.data.data;
        setEditing(created._id);
        setForm({
          title: created.title,
          shortDescription: created.shortDescription,
          fullDescription: created.fullDescription || "",
          technologies: (created.technologies || []).join(", "),
          githubUrl: created.githubUrl || "",
          liveUrl: created.liveUrl || "",
          category: created.category,
          status: created.status,
          isPublished: created.isPublished,
        });
        setImages({ thumbnail: null, banner: null, gallery: [] });
      } else {
        await api.put(`/projects/${editing}`, payload);
        closeForm();
      }
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project? This also removes all of its images.")) return;
    try {
      await api.delete(`/projects/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete project");
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField("thumbnail");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post(`/projects/${editing}/thumbnail`, formData, uploadHeaders);
      setImages((prev) => ({ ...prev, thumbnail: res.data.data }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload thumbnail");
    } finally {
      setUploadingField(null);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  };

  const handleThumbnailDelete = async () => {
    if (!confirm("Remove the thumbnail image?")) return;
    await api.delete(`/projects/${editing}/thumbnail`);
    setImages((prev) => ({ ...prev, thumbnail: null }));
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField("banner");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post(`/projects/${editing}/banner`, formData, uploadHeaders);
      setImages((prev) => ({ ...prev, banner: res.data.data }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload banner");
    } finally {
      setUploadingField(null);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleBannerDelete = async () => {
    if (!confirm("Remove the banner image?")) return;
    await api.delete(`/projects/${editing}/banner`);
    setImages((prev) => ({ ...prev, banner: null }));
  };

  const handleGalleryAdd = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField("gallery");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post(`/projects/${editing}/gallery`, formData, uploadHeaders);
      setImages((prev) => ({ ...prev, gallery: res.data.data }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload gallery image");
    } finally {
      setUploadingField(null);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const handleGalleryRemove = async (imageId) => {
    if (!confirm("Remove this gallery image?")) return;
    const res = await api.delete(`/projects/${editing}/gallery/${imageId}`);
    setImages((prev) => ({ ...prev, gallery: res.data.data }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Projects</h1>
        <button onClick={openNew} className="btn-primary !py-2 !px-4 text-sm">
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="glass-card p-6 mb-8 space-y-4 relative">
          <button type="button" onClick={closeForm} className="absolute top-4 right-4 text-white/40 hover:text-white">
            <X size={18} />
          </button>
          <h2 className="font-display text-lg font-semibold">
            {editing === "new" ? "New Project" : "Edit Project"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            >
              <option>Full Stack</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Salesforce</option>
              <option>Other</option>
            </select>
          </div>
          <input
            required
            placeholder="Short description"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
          />
          <textarea
            placeholder="Full description"
            rows={3}
            value={form.fullDescription}
            onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm resize-none"
          />

          {editing === "new" ? (
            <p className="text-xs text-white/40 glass-card p-3">
              Save the project first — thumbnail, banner, and gallery images can be added right
              after, without leaving this form.
            </p>
          ) : (
            <div className="space-y-5 border-t border-white/10 pt-5">
              {/* Thumbnail */}
              <div>
                <p className="text-sm text-white/60 mb-2">Thumbnail (shown on the project grid)</p>
                <div className="flex items-center gap-4">
                  {images.thumbnail?.url ? (
                    <img
                      src={images.thumbnail.url}
                      alt="Thumbnail preview"
                      className="h-16 w-24 rounded-lg object-cover bg-white/5"
                    />
                  ) : (
                    <div className="h-16 w-24 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                      <ImageOff size={20} />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="btn-secondary !py-2 !px-4 text-sm cursor-pointer inline-flex">
                      {uploadingField === "thumbnail" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {uploadingField === "thumbnail" ? "Uploading…" : images.thumbnail ? "Replace" : "Upload"}
                    </label>
                    {images.thumbnail && (
                      <button
                        type="button"
                        onClick={handleThumbnailDelete}
                        className="btn-secondary !py-2 !px-3 text-sm text-red-400 hover:!bg-red-500/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Banner */}
              <div>
                <p className="text-sm text-white/60 mb-2">Banner (hero image on the project detail page)</p>
                <div className="flex items-center gap-4">
                  {images.banner?.url ? (
                    <img
                      src={images.banner.url}
                      alt="Banner preview"
                      className="h-16 w-28 rounded-lg object-cover bg-white/5"
                    />
                  ) : (
                    <div className="h-16 w-28 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                      <ImageOff size={20} />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleBannerUpload}
                      className="hidden"
                      id="banner-upload"
                    />
                    <label htmlFor="banner-upload" className="btn-secondary !py-2 !px-4 text-sm cursor-pointer inline-flex">
                      {uploadingField === "banner" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {uploadingField === "banner" ? "Uploading…" : images.banner ? "Replace" : "Upload"}
                    </label>
                    {images.banner && (
                      <button
                        type="button"
                        onClick={handleBannerDelete}
                        className="btn-secondary !py-2 !px-3 text-sm text-red-400 hover:!bg-red-500/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div>
                <p className="text-sm text-white/60 mb-2">
                  Gallery ({images.gallery.length} / 20)
                </p>
                <div className="flex flex-wrap gap-3">
                  {images.gallery.map((img) => (
                    <div key={img._id} className="relative group">
                      <img
                        src={img.url}
                        alt="Gallery"
                        className="h-16 w-24 rounded-lg object-cover bg-white/5"
                      />
                      <button
                        type="button"
                        onClick={() => handleGalleryRemove(img._id)}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {images.gallery.length < 20 && (
                    <>
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleGalleryAdd}
                        className="hidden"
                        id="gallery-upload"
                      />
                      <label
                        htmlFor="gallery-upload"
                        className="h-16 w-24 rounded-lg border-2 border-dashed border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 cursor-pointer transition-colors"
                      >
                        {uploadingField === "gallery" ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Plus size={18} />
                        )}
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <input
            placeholder="Technologies (comma separated)"
            value={form.technologies}
            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              placeholder="GitHub URL"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
            <input
              placeholder="Live Demo URL"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
          </div>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
          >
            <option>In Progress</option>
            <option>Completed</option>
            <option>Planned</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-white/60">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="h-4 w-4 rounded accent-accent"
            />
            Published (visible on the live site)
          </label>
          <button type="submit" disabled={saving} className="btn-primary text-sm">
            {saving ? "Saving…" : editing === "new" ? "Create Project" : "Save Changes"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div key={p._id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-semibold">{p.title}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-white/40 hover:text-white">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="text-white/40 hover:text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-white/50">{p.shortDescription}</p>
              <span
                className={`inline-block text-xs mt-3 px-2 py-1 rounded-full border ${
                  p.isPublished
                    ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                    : "border-white/10 text-white/40 bg-white/5"
                }`}
              >
                {p.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Pencil, X, Upload, Loader2 } from "lucide-react";
import api from "../../services/api.js";

const emptyForm = { name: "", category: "Frontend", icon: "", order: 0, isPublished: false };

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // "new" | skillId | null
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => {
    setLoading(true);
    api
      .get("/skills/admin")
      .then((res) => setSkills(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditingId("new");
    setForm(emptyForm);
  };

  const openEdit = (skill) => {
    setEditingId(skill._id);
    setForm({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || "",
      order: skill.order || 0,
      isPublished: skill.isPublished,
    });
  };

  const closeForm = () => setEditingId(null);

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload", formData, {
        // See AdminProjects.jsx for why this must be undefined, not a
        // manually-set "multipart/form-data" string without a boundary.
        headers: { "Content-Type": undefined },
      });
      setForm((f) => ({ ...f, icon: res.data.data.url }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload icon");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId === "new") {
        await api.post("/skills", form);
      } else {
        await api.put(`/skills/${editingId}`, form);
      }
      closeForm();
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete skill");
    }
  };

  const togglePublish = async (skill) => {
    try {
      await api.put(`/skills/${skill._id}`, { isPublished: !skill.isPublished });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update publish status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Skills</h1>
        <button onClick={openNew} className="btn-primary !py-2 !px-4 text-sm">
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      {editingId && (
        <form onSubmit={handleSave} className="glass-card p-6 mb-8 space-y-4 relative">
          <button type="button" onClick={closeForm} className="absolute top-4 right-4 text-white/40 hover:text-white">
            <X size={18} />
          </button>
          <h2 className="font-display text-lg font-semibold">
            {editingId === "new" ? "New Skill" : "Edit Skill"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Skill name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            >
              <option>Frontend</option>
              <option>Backend</option>
              <option>Salesforce</option>
              <option>Tools</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            {form.icon ? (
              <img src={form.icon} alt="Skill icon" className="h-12 w-12 rounded-lg object-contain bg-white/5 p-1" />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center text-white/20 text-xs">
                No icon
              </div>
            )}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleIconUpload}
                className="hidden"
                id="skill-icon-upload"
              />
              <label
                htmlFor="skill-icon-upload"
                className="btn-secondary !py-2 !px-4 text-sm cursor-pointer inline-flex"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? "Uploading…" : form.icon ? "Replace Icon" : "Upload Icon"}
              </label>
              <p className="text-xs text-white/30 mt-1">Uploaded to Cloudinary via /api/upload</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-white/60 mt-6">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="h-4 w-4 rounded accent-accent"
              />
              Published (visible on the live site)
            </label>
          </div>

          <button type="submit" disabled={saving || uploading} className="btn-primary text-sm">
            {saving ? "Saving…" : "Save Skill"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : skills.length === 0 ? (
        <p className="text-white/40 text-sm">No skills added yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill) => (
            <div key={skill._id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {skill.icon ? (
                    <img src={skill.icon} alt="" className="h-8 w-8 rounded-md object-contain bg-white/5 p-1" />
                  ) : (
                    <div className="h-8 w-8 rounded-md bg-white/5" />
                  )}
                  <div>
                    <h3 className="font-display font-semibold text-sm">{skill.name}</h3>
                    <p className="text-xs text-white/40">{skill.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(skill)} className="text-white/40 hover:text-white">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(skill._id)} className="text-white/40 hover:text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => togglePublish(skill)}
                className={`text-xs mt-2 px-2 py-1 rounded-full border ${
                  skill.isPublished
                    ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                    : "border-white/10 text-white/40 bg-white/5"
                }`}
              >
                {skill.isPublished ? "Published" : "Draft"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import api from "../../services/api.js";

const emptyEntry = { degree: "", institution: "", period: "", description: "", isPublished: false };

export default function AdminEducation() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // "new" | entryId | null
  const [form, setForm] = useState(emptyEntry);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/education/admin")
      .then((res) => setEntries(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditingId("new");
    setForm(emptyEntry);
  };

  const openEdit = (entry) => {
    setEditingId(entry._id);
    setForm({
      degree: entry.degree,
      institution: entry.institution,
      period: entry.period || "",
      description: entry.description || "",
      isPublished: entry.isPublished,
    });
  };

  const closeForm = () => setEditingId(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId === "new") {
        await api.post("/education", form);
      } else {
        await api.put(`/education/${editingId}`, form);
      }
      closeForm();
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save education entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this education entry?")) return;
    try {
      await api.delete(`/education/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete education entry");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Education</h1>
        <button onClick={openNew} className="btn-primary !py-2 !px-4 text-sm">
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      {editingId && (
        <form onSubmit={handleSave} className="glass-card p-6 mb-8 space-y-4 relative">
          <button type="button" onClick={closeForm} className="absolute top-4 right-4 text-white/40 hover:text-white">
            <X size={18} />
          </button>
          <h2 className="font-display text-lg font-semibold">
            {editingId === "new" ? "New Education Entry" : "Edit Education Entry"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Degree"
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
            <input
              required
              placeholder="Institution"
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
          </div>
          <input
            placeholder="Period (e.g. 2021 - 2024)"
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
          />
          <textarea
            rows={3}
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm resize-none"
          />
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
            {saving ? "Saving…" : "Save Entry"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-white/40 text-sm">No education entries added yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {entries.map((entry) => (
            <div key={entry._id} className="glass-card p-6">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-display font-semibold">{entry.degree}</h3>
                  <p className="text-sm text-accent-light">{entry.institution}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      entry.isPublished
                        ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                        : "border-white/10 text-white/40 bg-white/5"
                    }`}
                  >
                    {entry.isPublished ? "Published" : "Draft"}
                  </span>
                  <button onClick={() => openEdit(entry)} className="text-white/40 hover:text-white">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(entry._id)} className="text-white/40 hover:text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {entry.period && <p className="text-xs text-white/40 mb-2">{entry.period}</p>}
              {entry.description && <p className="text-sm text-white/60">{entry.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

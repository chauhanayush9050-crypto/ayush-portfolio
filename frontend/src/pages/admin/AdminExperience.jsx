import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import api from "../../services/api.js";

const emptyEntry = { title: "", organization: "", period: "", description: "", type: "Development", isPublished: false };

export default function AdminExperience() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // "new" | entryId | null
  const [form, setForm] = useState(emptyEntry);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/experience/admin")
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
      title: entry.title,
      organization: entry.organization,
      period: entry.period || "",
      description: entry.description || "",
      type: entry.type || "Development",
      isPublished: entry.isPublished,
    });
  };

  const closeForm = () => setEditingId(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId === "new") {
        await api.post("/experience", form);
      } else {
        await api.put(`/experience/${editingId}`, form);
      }
      closeForm();
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save experience entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience entry?")) return;
    try {
      await api.delete(`/experience/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete experience entry");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Experience</h1>
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
            {editingId === "new" ? "New Experience Entry" : "Edit Experience Entry"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
            <input
              required
              placeholder="Organization"
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Period (e.g. 2023 - Present)"
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            >
              <option>Development</option>
              <option>Salesforce</option>
              <option>Other</option>
            </select>
          </div>
          <textarea
            rows={3}
            placeholder="Description"
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
        <p className="text-white/40 text-sm">No experience entries added yet.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry._id} className="glass-card p-6">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-display font-semibold">{entry.title}</h3>
                  <p className="text-sm text-accent-light">{entry.organization}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {entry.period && <span className="badge">{entry.period}</span>}
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
              {entry.description && <p className="text-sm text-white/60">{entry.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Upload, Trash2, Download, FileText, Loader2 } from "lucide-react";
import api from "../../services/api.js";

export default function AdminResume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => {
    setLoading(true);
    api
      .get("/resume")
      .then((res) => setResume(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed for the resume.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      await api.post("/resume", formData, {
        // See AdminProjects.jsx for why this must be undefined, not a
        // manually-set "multipart/form-data" string without a boundary.
        headers: { "Content-Type": undefined },
      });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete the current resume? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete("/resume");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete resume");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold mb-8">Resume</h1>

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : (
        <div className="glass-card p-6 space-y-6">
          {resume ? (
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent-light shrink-0">
                <FileText size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{resume.fileName}</p>
                <p className="text-xs text-white/40">
                  Uploaded {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleString() : "—"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-white/40 text-sm">No resume uploaded yet.</p>
          )}

          <div className="flex flex-wrap gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="btn-primary text-sm cursor-pointer">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? "Uploading…" : resume ? "Replace Resume" : "Upload Resume"}
            </label>

            {resume && (
              <>
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="btn-secondary text-sm"
                >
                  <Download size={16} />
                  Download
                </a>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn-secondary text-sm text-red-400 hover:!bg-red-500/10 disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </>
            )}
          </div>

          <p className="text-xs text-white/30">
            Only one resume can be active at a time. Uploading a new file automatically replaces
            and deletes the previous one.
          </p>
        </div>
      )}
    </div>
  );
}

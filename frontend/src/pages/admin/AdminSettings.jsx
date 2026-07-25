import { useEffect, useRef, useState } from "react";
import { Save, Upload, Trash2, Loader2, ImageOff } from "lucide-react";
import api from "../../services/api.js";
import { SOCIAL_PLATFORMS } from "../../config/socialPlatforms.js";

const emptyProfile = {
  fullName: "",
  headline: "",
  bio: "",
  email: "",
  phone: "",
  location: "",
  website: "",
};

const emptySocial = SOCIAL_PLATFORMS.reduce((acc, p) => ({ ...acc, [p.key]: "" }), {});

const emptyPortfolio = {
  title: "",
  description: "",
  seoTitle: "",
  seoDescription: "",
  footerText: "",
  copyrightText: "",
};

const IMAGE_FIELDS = [
  { key: "profilePhoto", label: "Profile Photo" },
  { key: "coverImage", label: "Cover Image" },
  { key: "logo", label: "Portfolio Logo" },
  { key: "favicon", label: "Website Favicon" },
];

// Small helper: shows a status message ("saving" | "saved" | "error") for a couple seconds
function useSaveStatus() {
  const [status, setStatus] = useState("");
  const flash = (s) => {
    setStatus(s);
    if (s === "saved") setTimeout(() => setStatus(""), 2000);
  };
  return [status, flash];
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [socialForm, setSocialForm] = useState(emptySocial);
  const [portfolioForm, setPortfolioForm] = useState(emptyPortfolio);
  const [images, setImages] = useState({});

  const [profileStatus, setProfileStatus] = useSaveStatus();
  const [socialStatus, setSocialStatus] = useSaveStatus();
  const [portfolioStatus, setPortfolioStatus] = useSaveStatus();
  const [uploadingField, setUploadingField] = useState(null);
  const [deletingField, setDeletingField] = useState(null);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState("");

  const fileInputRefs = useRef({});

  const load = () => {
    setLoading(true);
    api
      .get("/settings")
      .then((res) => {
        const data = res.data.data;
        setProfileForm({ ...emptyProfile, ...data.profile });
        setSocialForm({ ...emptySocial, ...data.socialLinks });
        setPortfolioForm({ ...emptyPortfolio, ...data.portfolioSettings });
        setImages(data.images || {});
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileStatus("saving");
    try {
      await api.put("/settings/profile", profileForm);
      setProfileStatus("saved");
    } catch {
      setProfileStatus("error");
    }
  };

  const saveSocial = async (e) => {
    e.preventDefault();
    setSocialStatus("saving");
    try {
      await api.put("/settings/social", socialForm);
      setSocialStatus("saved");
    } catch {
      setSocialStatus("error");
    }
  };

  const savePortfolio = async (e) => {
    e.preventDefault();
    setPortfolioStatus("saving");
    try {
      await api.put("/settings/portfolio", portfolioForm);
      setPortfolioStatus("saved");
    } catch {
      setPortfolioStatus("error");
    }
  };

  const handleImageUpload = async (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post(`/settings/images/${field}`, formData, {
        // See AdminProjects.jsx for why this must be undefined, not a
        // manually-set "multipart/form-data" string without a boundary.
        headers: { "Content-Type": undefined },
      });
      setImages((prev) => ({ ...prev, [field]: res.data.data.url }));
    } catch (err) {
      alert(err.response?.data?.message || `Failed to upload ${field}`);
    } finally {
      setUploadingField(null);
      if (fileInputRefs.current[field]) fileInputRefs.current[field].value = "";
    }
  };

  const handleImageDelete = async (field) => {
    if (!confirm("Delete this image?")) return;
    setDeletingField(field);
    try {
      await api.delete(`/settings/images/${field}`);
      setImages((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      alert(err.response?.data?.message || `Failed to delete ${field}`);
    } finally {
      setDeletingField(null);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus("saving");
    try {
      await api.put("/auth/change-password", passwordForm);
      setPasswordStatus("saved");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => setPasswordStatus(""), 2000);
    } catch (err) {
      setPasswordStatus(err.response?.data?.message || "error");
    }
  };

  if (loading) {
    return <p className="text-white/40 text-sm">Loading…</p>;
  }

  return (
    <div className="max-w-3xl space-y-10">
      <h1 className="font-display text-2xl font-semibold">Profile &amp; Settings</h1>

      {/* ---------------- Personal Information ---------------- */}
      <form onSubmit={saveProfile} className="glass-card p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold">Personal Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            placeholder="Full Name"
            value={profileForm.fullName}
            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
          />
          <input
            placeholder="Professional Headline"
            value={profileForm.headline}
            onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
          />
        </div>
        <textarea
          rows={3}
          placeholder="Short Bio"
          value={profileForm.bio}
          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm resize-none"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email Address"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
          />
          <input
            placeholder="Phone Number (optional)"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            placeholder="Location"
            value={profileForm.location}
            onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
          />
          <input
            placeholder="Website URL (optional)"
            value={profileForm.website}
            onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
          />
        </div>
        <button type="submit" disabled={profileStatus === "saving"} className="btn-primary text-sm">
          <Save size={16} />
          {profileStatus === "saving" ? "Saving…" : "Save Personal Info"}
        </button>
        {profileStatus === "saved" && <p className="text-emerald-400 text-sm">Saved!</p>}
        {profileStatus === "error" && <p className="text-red-400 text-sm">Failed to save.</p>}
      </form>

      {/* ---------------- Social Links ---------------- */}
      <form onSubmit={saveSocial} className="glass-card p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold">Social Links</h2>
        <p className="text-xs text-white/40">
          Leave a field empty to hide that icon on the live site. Clearing a URL and saving deletes it.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {SOCIAL_PLATFORMS.map(({ key, label }) => (
            <input
              key={key}
              placeholder={`${label} URL`}
              value={socialForm[key]}
              onChange={(e) => setSocialForm({ ...socialForm, [key]: e.target.value })}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
          ))}
        </div>
        <button type="submit" disabled={socialStatus === "saving"} className="btn-primary text-sm">
          <Save size={16} />
          {socialStatus === "saving" ? "Saving…" : "Save Social Links"}
        </button>
        {socialStatus === "saved" && <p className="text-emerald-400 text-sm">Saved!</p>}
        {socialStatus === "error" && <p className="text-red-400 text-sm">Failed to save.</p>}
      </form>

      {/* ---------------- Profile Images ---------------- */}
      <div className="glass-card p-6 space-y-6">
        <h2 className="font-display text-lg font-semibold">Profile Images</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {IMAGE_FIELDS.map(({ key, label }) => (
            <div key={key} className="space-y-3">
              <p className="text-sm text-white/60">{label}</p>
              <div className="h-28 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                {images[key] ? (
                  <img src={images[key]} alt={label} className="h-full w-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-white/20">
                    <ImageOff size={22} />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  ref={(el) => (fileInputRefs.current[key] = el)}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) => handleImageUpload(key, e)}
                  className="hidden"
                  id={`image-upload-${key}`}
                />
                <label
                  htmlFor={`image-upload-${key}`}
                  className="btn-secondary !py-2 !px-3 text-xs cursor-pointer inline-flex flex-1 justify-center"
                >
                  {uploadingField === key ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {uploadingField === key ? "Uploading…" : images[key] ? "Replace" : "Upload"}
                </label>
                {images[key] && (
                  <button
                    type="button"
                    onClick={() => handleImageDelete(key)}
                    disabled={deletingField === key}
                    className="btn-secondary !py-2 !px-3 text-xs text-red-400 hover:!bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- Portfolio / SEO Settings ---------------- */}
      <form onSubmit={savePortfolio} className="glass-card p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold">Portfolio &amp; SEO Settings</h2>
        <input
          placeholder="Portfolio Title"
          value={portfolioForm.title}
          onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
        />
        <textarea
          rows={2}
          placeholder="Portfolio Description"
          value={portfolioForm.description}
          onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm resize-none"
        />
        <input
          placeholder="SEO Title"
          value={portfolioForm.seoTitle}
          onChange={(e) => setPortfolioForm({ ...portfolioForm, seoTitle: e.target.value })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
        />
        <textarea
          rows={2}
          placeholder="SEO Description"
          value={portfolioForm.seoDescription}
          onChange={(e) => setPortfolioForm({ ...portfolioForm, seoDescription: e.target.value })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm resize-none"
        />
        <input
          placeholder="Footer Text"
          value={portfolioForm.footerText}
          onChange={(e) => setPortfolioForm({ ...portfolioForm, footerText: e.target.value })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
        />
        <input
          placeholder="Copyright Text"
          value={portfolioForm.copyrightText}
          onChange={(e) => setPortfolioForm({ ...portfolioForm, copyrightText: e.target.value })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
        />
        <button type="submit" disabled={portfolioStatus === "saving"} className="btn-primary text-sm">
          <Save size={16} />
          {portfolioStatus === "saving" ? "Saving…" : "Save Portfolio Settings"}
        </button>
        {portfolioStatus === "saved" && <p className="text-emerald-400 text-sm">Saved!</p>}
        {portfolioStatus === "error" && <p className="text-red-400 text-sm">Failed to save.</p>}
      </form>

      {/* ---------------- Change Password ---------------- */}
      <form onSubmit={changePassword} className="glass-card p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold">Change Password</h2>
        <input
          type="password"
          placeholder="Current password"
          value={passwordForm.currentPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
        />
        <input
          type="password"
          placeholder="New password (min 8 characters)"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
        />
        <button type="submit" className="btn-primary text-sm">
          {passwordStatus === "saving" ? "Updating…" : "Update Password"}
        </button>
        {passwordStatus === "saved" && <p className="text-emerald-400 text-sm">Password updated!</p>}
        {passwordStatus && passwordStatus !== "saving" && passwordStatus !== "saved" && (
          <p className="text-red-400 text-sm">{passwordStatus}</p>
        )}
      </form>
    </div>
  );
}

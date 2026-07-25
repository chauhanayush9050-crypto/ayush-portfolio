import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Pencil, X, ArrowUp, ArrowDown } from "lucide-react";
import api from "../../services/api.js";
import { FEATURE_ICON_NAMES, FEATURE_ICONS } from "../../config/featureIcons.js";

const emptyCard = { title: "", icon: FEATURE_ICON_NAMES[0], isPublished: false };

export default function AdminAbout() {
  // --- About text (unchanged from before) ---
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); // "" | "saving" | "saved" | "error"

  // --- Feature cards (new) ---
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // "new" | card._id | null
  const [cardForm, setCardForm] = useState(emptyCard);
  const [cardSaving, setCardSaving] = useState(false);

  useEffect(() => {
    api
      .get("/about")
      .then((res) => setAboutText(res.data.data.aboutText || ""))
      .finally(() => setLoading(false));
  }, []);

  const loadCards = () => {
    setCardsLoading(true);
    api
      .get("/about/feature-cards/admin")
      .then((res) => setCards(res.data.data))
      .finally(() => setCardsLoading(false));
  };

  useEffect(loadCards, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await api.put("/about", { aboutText });
      setStatus("saved");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("error");
    }
  };

  const openNewCard = () => {
    setEditingId("new");
    setCardForm(emptyCard);
  };

  const openEditCard = (card) => {
    setEditingId(card._id);
    setCardForm({ title: card.title, icon: card.icon, isPublished: card.isPublished });
  };

  const closeCardForm = () => setEditingId(null);

  const handleSaveCard = async (e) => {
    e.preventDefault();
    setCardSaving(true);
    try {
      if (editingId === "new") {
        await api.post("/about/feature-cards", cardForm);
      } else {
        await api.put(`/about/feature-cards/${editingId}`, cardForm);
      }
      closeCardForm();
      loadCards();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save feature card");
    } finally {
      setCardSaving(false);
    }
  };

  const handleDeleteCard = async (id) => {
    if (!confirm("Delete this feature card?")) return;
    try {
      await api.delete(`/about/feature-cards/${id}`);
      loadCards();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete feature card");
    }
  };

  const moveCard = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    const current = cards[index];
    const target = cards[targetIndex];

    try {
      await Promise.all([
        api.put(`/about/feature-cards/${current._id}`, { order: target.order }),
        api.put(`/about/feature-cards/${target._id}`, { order: current.order }),
      ]);
      loadCards();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reorder feature cards");
    }
  };

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold mb-8">About</h1>

        {loading ? (
          <p className="text-white/40 text-sm">Loading…</p>
        ) : (
          <form onSubmit={handleSave} className="glass-card p-6 space-y-4">
            <label className="block text-sm text-white/60">About Text</label>
            <textarea
              rows={8}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Nothing saved yet — write your About section here."
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm resize-none focus:outline-none focus:border-accent transition-colors"
            />
            <button type="submit" disabled={status === "saving"} className="btn-primary text-sm">
              <Save size={16} />
              {status === "saving" ? "Saving…" : "Save About"}
            </button>
            {status === "saved" && <p className="text-emerald-400 text-sm">Saved!</p>}
            {status === "error" && <p className="text-red-400 text-sm">Failed to save. Please try again.</p>}
          </form>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">Feature Cards</h2>
          <button onClick={openNewCard} className="btn-primary !py-2 !px-4 text-sm">
            <Plus size={16} />
            Add Card
          </button>
        </div>

        {editingId && (
          <form onSubmit={handleSaveCard} className="glass-card p-6 mb-6 space-y-4 relative">
            <button
              type="button"
              onClick={closeCardForm}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="font-display text-base font-semibold">
              {editingId === "new" ? "New Feature Card" : "Edit Feature Card"}
            </h3>
            <input
              required
              placeholder="Title (e.g. Problem Solving)"
              value={cardForm.title}
              onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            />
            <select
              value={cardForm.icon}
              onChange={(e) => setCardForm({ ...cardForm, icon: e.target.value })}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            >
              {FEATURE_ICON_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-white/60">
              <input
                type="checkbox"
                checked={cardForm.isPublished}
                onChange={(e) => setCardForm({ ...cardForm, isPublished: e.target.checked })}
                className="h-4 w-4 rounded accent-accent"
              />
              Published (visible on the live site)
            </label>
            <button type="submit" disabled={cardSaving} className="btn-primary text-sm">
              {cardSaving ? "Saving…" : "Save Card"}
            </button>
          </form>
        )}

        {cardsLoading ? (
          <p className="text-white/40 text-sm">Loading…</p>
        ) : cards.length === 0 ? (
          <p className="text-white/40 text-sm">No feature cards added yet.</p>
        ) : (
          <div className="space-y-3">
            {cards.map((card, index) => {
              const Icon = FEATURE_ICONS[card.icon];
              return (
                <div key={card._id} className="glass-card p-4 flex items-center gap-3">
                  <div className="shrink-0 h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    {Icon && <Icon size={18} className="text-accent-light" />}
                  </div>
                  <span className="flex-1 text-sm font-medium">{card.title}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border shrink-0 ${
                      card.isPublished
                        ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                        : "border-white/10 text-white/40 bg-white/5"
                    }`}
                  >
                    {card.isPublished ? "Published" : "Draft"}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveCard(index, -1)}
                      disabled={index === 0}
                      className="text-white/40 hover:text-white disabled:opacity-20 disabled:hover:text-white/40"
                      aria-label="Move up"
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      onClick={() => moveCard(index, 1)}
                      disabled={index === cards.length - 1}
                      className="text-white/40 hover:text-white disabled:opacity-20 disabled:hover:text-white/40"
                      aria-label="Move down"
                    >
                      <ArrowDown size={15} />
                    </button>
                    <button onClick={() => openEditCard(card)} className="text-white/40 hover:text-white">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDeleteCard(card._id)} className="text-white/40 hover:text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

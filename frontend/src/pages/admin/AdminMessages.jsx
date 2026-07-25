import { useEffect, useState } from "react";
import { Trash2, MailOpen } from "lucide-react";
import api from "../../services/api.js";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/messages")
      .then((res) => setMessages(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark message as read");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete message");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-8">Messages</h1>

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="text-white/40 text-sm">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m._id} className="glass-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-medium">
                    {m.name} <span className="text-white/40 font-normal">— {m.email}</span>
                  </p>
                  <p className="text-sm text-accent-light">{m.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!m.isRead && (
                    <button onClick={() => markRead(m._id)} className="text-white/40 hover:text-white" title="Mark as read">
                      <MailOpen size={16} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(m._id)} className="text-white/40 hover:text-red-400" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-white/60">{m.message}</p>
              <p className="text-xs text-white/30 mt-3">{new Date(m.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

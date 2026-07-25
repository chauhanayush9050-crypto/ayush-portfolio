import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, MessageSquare, Users, ArrowRight } from "lucide-react";
import api from "../../services/api.js";

export default function AdminDashboard() {
  const [projectsCount, setProjectsCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/projects/admin"),
      api.get("/messages"),
      api.get("/analytics/dashboard"),
    ])
      .then(([projectsRes, messagesRes, analyticsRes]) => {
        setProjectsCount(projectsRes.data.count ?? projectsRes.data.data.length);
        setMessages(messagesRes.data.data.slice(0, 5));
        setAnalytics(analyticsRes.data.data);
      })
      .catch(() =>
        setError("Couldn't load dashboard data yet — this will work once MongoDB is connected.")
      )
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Projects", value: projectsCount, icon: FolderKanban, color: "text-sky-400" },
    { label: "Messages", value: analytics?.totalContactMessages ?? 0, icon: MessageSquare, color: "text-emerald-400" },
    { label: "Total Visitors", value: analytics?.totalVisitors ?? 0, icon: Users, color: "text-amber-400" },
    { label: "Unique Visitors", value: analytics?.uniqueVisitors ?? 0, icon: Users, color: "text-accent-light" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-8">Dashboard</h1>

      {error && <div className="glass-card p-4 mb-6 text-sm text-amber-300">{error}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-6">
            <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-3xl font-display font-semibold">{loading ? "—" : value}</p>
            <p className="text-sm text-white/40 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <Link
        to="/admin/analytics"
        className="glass-card p-4 mb-10 flex items-center justify-between hover:border-accent/40 transition-colors"
      >
        <span className="text-sm text-white/60">
          View full visitor analytics — charts, device breakdown, traffic sources, project rankings
        </span>
        <ArrowRight size={16} className="text-accent-light shrink-0" />
      </Link>

      <div className="glass-card p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Latest Messages</h2>
        {loading ? (
          <p className="text-white/40 text-sm">Loading…</p>
        ) : messages.length ? (
          <ul className="divide-y divide-white/5">
            {messages.map((msg) => (
              <li key={msg._id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{msg.name}</p>
                  <p className="text-xs text-white/40">{msg.subject}</p>
                </div>
                {!msg.isRead && <span className="badge">New</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/40 text-sm">No messages yet.</p>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  Users,
  Eye,
  Download,
  Github,
  Linkedin,
  MessageSquare,
  TrendingUp,
  FolderKanban,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import api from "../../services/api.js";

const STAT_CARDS = [
  { key: "totalVisitors", label: "Total Visitors", icon: Users, color: "text-sky-400" },
  { key: "uniqueVisitors", label: "Unique Visitors", icon: Users, color: "text-emerald-400" },
  { key: "totalPageViews", label: "Total Page Views", icon: Eye, color: "text-accent-light" },
  { key: "todayVisitors", label: "Today", icon: TrendingUp, color: "text-amber-400" },
  { key: "weekVisitors", label: "This Week", icon: TrendingUp, color: "text-amber-400" },
  { key: "monthVisitors", label: "This Month", icon: TrendingUp, color: "text-amber-400" },
  { key: "totalResumeDownloads", label: "Resume Downloads", icon: Download, color: "text-emerald-400" },
  { key: "totalGithubClicks", label: "GitHub Clicks", icon: Github, color: "text-white" },
  { key: "totalLinkedinClicks", label: "LinkedIn Clicks", icon: Linkedin, color: "text-sky-400" },
  { key: "totalContactMessages", label: "Contact Messages", icon: MessageSquare, color: "text-accent-light" },
];

const PIE_COLORS = ["#3B82F6", "#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA"];

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#1E293B",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#fff",
};

export default function AdminAnalytics() {
  const [dashboard, setDashboard] = useState(null);
  const [charts, setCharts] = useState(null);
  const [projectAnalytics, setProjectAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("daily"); // daily | weekly | monthly

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/analytics/dashboard"),
      api.get("/analytics/charts"),
      api.get("/analytics/projects"),
    ])
      .then(([d, c, p]) => {
        setDashboard(d.data.data);
        setCharts(c.data.data);
        setProjectAnalytics(p.data.data);
      })
      .catch(() => {
        // dashboard stays null, which the render below already handles
        // with a friendly "couldn't load analytics yet" message
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-white/40 text-sm">Loading analytics…</p>;
  }

  if (!dashboard) {
    return (
      <p className="text-amber-300 text-sm">
        Couldn't load analytics yet — this will populate once MongoDB is connected and real
        visitors start arriving.
      </p>
    );
  }

  const rangeData = { daily: charts?.daily, weekly: charts?.weekly, monthly: charts?.monthly }[range] || [];
  const rangeKey = { daily: "date", weekly: "week", monthly: "month" }[range];

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-semibold">Visitor Analytics</h1>

      {/* ---------------- Summary stat cards ---------------- */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="glass-card p-5">
            <div className={`h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center mb-3 ${color}`}>
              <Icon size={17} />
            </div>
            <p className="text-2xl font-display font-semibold">{dashboard[key] ?? 0}</p>
            <p className="text-xs text-white/40 mt-1">{label}</p>
          </div>
        ))}

        <div className="glass-card p-5">
          <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center mb-3 text-accent-light">
            <FolderKanban size={17} />
          </div>
          <p className="text-sm font-display font-semibold truncate">
            {dashboard.mostViewedProject?.title || "—"}
          </p>
          <p className="text-xs text-white/40 mt-1">
            Most Viewed Project{dashboard.mostViewedProject ? ` (${dashboard.mostViewedProject.views})` : ""}
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center mb-3 text-sky-400">
            <Eye size={17} />
          </div>
          <p className="text-sm font-display font-semibold capitalize">
            {dashboard.mostViewedPage?.page || "—"}
          </p>
          <p className="text-xs text-white/40 mt-1">
            Most Viewed Page{dashboard.mostViewedPage ? ` (${dashboard.mostViewedPage.views})` : ""}
          </p>
        </div>
      </div>

      {/* ---------------- Visitors over time ---------------- */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-semibold">Visitors Over Time</h2>
          <div className="flex gap-1">
            {["daily", "weekly", "monthly"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${
                  range === r ? "bg-accent text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        {rangeData.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-16">No visitor data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={rangeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey={rangeKey} stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ---------------- Device distribution + Traffic sources ---------------- */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-display text-lg font-semibold mb-6">Device Distribution</h2>
          {!charts?.deviceDistribution?.length ? (
            <p className="text-white/30 text-sm text-center py-16">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={charts.deviceDistribution}
                  dataKey="count"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => entry.device}
                >
                  {charts.deviceDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="font-display text-lg font-semibold mb-6">Traffic Sources</h2>
          {!charts?.trafficSources?.length ? (
            <p className="text-white/30 text-sm text-center py-16">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={charts.trafficSources} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={11} allowDecimals={false} />
                <YAxis type="category" dataKey="source" stroke="rgba(255,255,255,0.3)" fontSize={11} width={80} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ---------------- Project analytics ---------------- */}
      <div className="glass-card p-6">
        <h2 className="font-display text-lg font-semibold mb-6">Project Views</h2>
        {!projectAnalytics?.projectViews?.length ? (
          <p className="text-white/30 text-sm text-center py-8">No projects yet.</p>
        ) : (
          <div className="space-y-2">
            {projectAnalytics.projectViews.map((p) => (
              <div
                key={p.projectId}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{p.title}</span>
                  {!p.isPublished && <span className="badge text-[10px]">Draft</span>}
                </div>
                <span className="text-sm text-white/50">{p.views} views</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

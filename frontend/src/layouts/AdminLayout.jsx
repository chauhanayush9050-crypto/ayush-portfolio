import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  MessageSquare,
  Settings,
  LogOut,
  User,
  Briefcase,
  GraduationCap,
  FileText,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/skills", label: "Skills", icon: Layers },
  { to: "/admin/about", label: "About", icon: User },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/education", label: "Education", icon: GraduationCap },
  { to: "/admin/resume", label: "Resume", icon: FileText },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white/50">Loading…</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 shrink-0 glass border-r border-white/10 p-6 hidden md:flex md:flex-col justify-between">
        <div>
          <p className="font-display text-lg font-semibold mb-8">
            Ayush<span className="text-accent">.</span> Admin
          </p>
          <nav className="space-y-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  location.pathname === to
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:bg-white/5 hover:text-red-400 transition-colors"
        >
          <LogOut size={17} />
          Log Out
        </button>
      </aside>

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

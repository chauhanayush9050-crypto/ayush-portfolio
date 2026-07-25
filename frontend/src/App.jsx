import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import Home from "./pages/Home.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import AdminProjects from "./pages/admin/AdminProjects.jsx";
import AdminSkills from "./pages/admin/AdminSkills.jsx";
import AdminAbout from "./pages/admin/AdminAbout.jsx";
import AdminExperience from "./pages/admin/AdminExperience.jsx";
import AdminEducation from "./pages/admin/AdminEducation.jsx";
import AdminResume from "./pages/admin/AdminResume.jsx";
import AdminMessages from "./pages/admin/AdminMessages.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";

export default function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen show={showLoader} />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/skills" element={<AdminSkills />} />
          <Route path="/admin/about" element={<AdminAbout />} />
          <Route path="/admin/experience" element={<AdminExperience />} />
          <Route path="/admin/education" element={<AdminEducation />} />
          <Route path="/admin/resume" element={<AdminResume />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

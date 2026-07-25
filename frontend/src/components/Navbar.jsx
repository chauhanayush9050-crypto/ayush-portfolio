import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useScrollSpy from "../hooks/useScrollSpy.js";
import useSiteSettings from "../hooks/useSiteSettings.js";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const NAV_SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(NAV_SECTION_IDS);
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const logoUrl = settings?.images?.logo || "";
  const faviconUrl = settings?.images?.favicon || "";

  useEffect(() => {
    if (!faviconUrl) return;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (id) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      // wait for navigation, then scroll
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogoClick = () => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-card py-3" : "bg-transparent py-5"
      }`}
    >
      <nav className="section-container flex items-center justify-between">
        <button
          onClick={handleLogoClick}
          className="font-display text-xl font-semibold tracking-tight text-white flex items-center gap-2"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            <>
              Ayush<span className="text-accent">.</span>
            </>
          )}
        </button>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeId === item.id
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {activeId === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => handleNavClick("contact")}
          className="hidden lg:inline-flex btn-primary !py-2.5 !px-5 text-sm"
        >
          Hire Me
        </button>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass mx-4 mt-3 rounded-2xl overflow-hidden"
          >
            <ul className="flex flex-col p-4 gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeId === item.id
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

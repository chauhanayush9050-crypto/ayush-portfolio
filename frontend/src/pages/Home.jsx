import useDocumentHead from "../hooks/useDocumentHead.js";
import useSiteSettings from "../hooks/useSiteSettings.js";
import useSectionTracking from "../hooks/useSectionTracking.js";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Skills from "../components/Skills.jsx";
import Projects from "../components/Projects.jsx";
import Experience from "../components/Experience.jsx";
import Education from "../components/Education.jsx";
import Contact from "../components/Contact.jsx";

const SECTION_IDS = ["home", "about", "skills", "projects", "experience", "education", "contact"];

export default function Home() {
  const { settings } = useSiteSettings();
  useSectionTracking(SECTION_IDS);

  useDocumentHead({
    title:
      settings?.portfolioSettings?.seoTitle ||
      "Ayush Chauhan | JavaScript Developer & Salesforce Administrator",
    description:
      settings?.portfolioSettings?.seoDescription ||
      "Portfolio of Ayush Chauhan — JavaScript Developer and Salesforce Administrator.",
  });

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Contact />
    </>
  );
}

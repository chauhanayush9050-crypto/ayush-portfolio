import { Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";
import useDocumentHead from "../hooks/useDocumentHead.js";

export default function NotFound() {
  useDocumentHead({ title: "Page Not Found | Ayush Chauhan" });

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6">
        <p className="font-display text-8xl font-semibold text-accent/40">404</p>
        <h1 className="font-display text-3xl font-semibold">This page doesn't exist</h1>
        <p className="text-white/50 max-w-md">
          The page you're looking for may have been moved or removed. Let's get you back on track.
        </p>
        <Link to="/" className="btn-primary">
          <HomeIcon size={18} />
          Back to Home
        </Link>
      </div>
    </>
  );
}

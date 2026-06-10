import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 pt-24 sm:pt-32 pb-20">
        <div className="text-center">
          <p
            className="text-7xl sm:text-8xl font-normal mb-4"
            style={{ fontFamily: "Playfair Display, serif", color: "var(--gold)" }}
          >
            404
          </p>
          <h1
            className="text-2xl sm:text-3xl font-normal mb-3"
            style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}
          >
            Page Not Found
          </h1>
          <p className="text-sm mb-10" style={{ color: "var(--cream-dim)" }}>
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <Link to="/" className="btn-gold inline-flex items-center gap-2">
            Back to Home <ArrowRight size={15} />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

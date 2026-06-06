import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function ContactPage() {
  return (
    <div>
      <Navbar />
      {/* Spacer to push content below the fixed navbar */}
      <div className="h-14 sm:h-20 lg:h-24" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >

      {/* Hero */}
      <div
        className="py-16 text-center"
        style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border)" }}
      >
        <p
          className="text-xs tracking-[0.35em] uppercase mb-3"
          style={{ color: "var(--cream-dim)" }}
        >
          We're here to help
        </p>
        <h1
          className="text-4xl md:text-5xl font-normal"
          style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}
        >
          Contact Us
        </h1>
        <p className="mt-3 text-sm max-w-md mx-auto px-4" style={{ color: "var(--cream-dim)" }}>
          Questions, custom orders, or just want to say hi — we'd love to hear from you.
        </p>
      </div>

      <ContactSection />

      <Footer />
    </motion.div>
    </div>
  );
}

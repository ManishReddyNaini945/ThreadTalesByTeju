import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

export default function RakhiBannerStrip() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    api.get("/settings/rakhi-banner")
      .then(({ data }) => setBanner(data))
      .catch(() => setBanner(null));
  }, []);

  if (!banner?.enabled || !banner?.image_url) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10"
    >
      {/* Pulsing golden glow to draw the eye */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0px rgba(200,164,92,0)",
            "0 0 32px rgba(200,164,92,0.55)",
            "0 0 0px rgba(200,164,92,0)",
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Link to="/rakhi" className="relative block group overflow-hidden" style={{ border: "1px solid var(--gold)" }}>
          <img
            src={banner.image_url}
            alt="Celebrate Raksha Bandhan — Flat 25% off"
            className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]"
          />

          {/* Shimmer sweep — periodic diagonal shine across the banner */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
          />
        </Link>
      </motion.div>
    </motion.div>
  );
}

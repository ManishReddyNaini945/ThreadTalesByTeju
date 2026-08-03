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
      <Link to="/rakhi" className="block group overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <img
          src={banner.image_url}
          alt="Celebrate Raksha Bandhan — Flat 25% off"
          className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </Link>
    </motion.div>
  );
}

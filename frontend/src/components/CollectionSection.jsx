import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Gem } from "lucide-react";
import { productService } from "../services/productService";

const CDN = "https://res.cloudinary.com/dilo6efzb/image/upload/threadtales/products";

// Photos for the original curated categories — used until an admin uploads
// a real image for that category via Admin -> Categories.
const FALLBACK_IMAGES = {
  "thread-bangles":     `${CDN}/pink_royal_thread_bangle_set.jpg`,
  "bridal-bangle-sets": `${CDN}/bridal_set_3.jpg`,
  "invisible-chains":   `${CDN}/invisible%20chain%206.jpg`,
  "hair-accessories":   `${CDN}/hair_clip_5.jpg`,
  "chains":             `${CDN}/chiain-set.png`,
  "saree-pins":         `${CDN}/saree_pin.jpg`,
};

export default function CollectionSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getCategories()
      .then(({ data }) => setCategories(Array.isArray(data) ? data.filter(c => c.product_count > 0) : []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && categories.length === 0) return null;

  const marqueeText = categories.map(c => c.name);
  const marqueeLoop = marqueeText.length ? [...marqueeText, ...marqueeText, ...marqueeText, ...marqueeText] : [];

  return (
    <section className="pt-8 pb-16 lg:py-32" style={{ background: "var(--bg)" }}>

      {/* Marquee strip */}
      {marqueeLoop.length > 0 && (
        <div className="overflow-hidden border-y py-4 mb-20" style={{ borderColor: "var(--border)" }}>
          <div className="marquee-track">
            {marqueeLoop.map((text, i) => (
              <span key={i} className="flex items-center gap-6 px-8 text-sm tracking-[0.25em] uppercase"
                style={{ color: i % 2 === 0 ? "var(--gold)" : "var(--cream-dim)" }}>
                {text}
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--gold)" }} />
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 lg:mb-16">
          <div>
            <p className="section-tag mb-4">Our Collections</p>
            <h2 className="section-title">
              Crafted for<br />
              Every Occasion
            </h2>
          </div>
          <Link to="/shop"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase transition-colors duration-200"
            style={{ color: "var(--gold)" }}>
            View All
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Collection Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: "4/3" }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {categories.map((cat, i) => {
              const displayImage = cat.image_url || FALLBACK_IMAGES[cat.slug];
              return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group block overflow-hidden"
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg-card)",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--gold)";
                    e.currentTarget.style.boxShadow = "0 0 30px rgba(200,164,92,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Image area */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", background: "var(--bg-2)" }}>
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        style={{ transform: "scale(1)", transition: "transform 0.7s ease" }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gem size={32} style={{ color: "var(--gold)", opacity: 0.4 }} />
                      </div>
                    )}
                    {/* Dark overlay */}
                    <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-60"
                      style={{ background: "rgba(12,10,9,0.35)", opacity: 0.2 }} />

                    {/* Index badge */}
                    <div className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center"
                      style={{ background: "rgba(12,10,9,0.75)", border: "1px solid var(--gold)" }}>
                      <span className="text-[10px] font-mono" style={{ color: "var(--gold)" }}>
                        0{i + 1}
                      </span>
                    </div>

                    {/* Arrow badge top right */}
                    <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ background: "var(--gold)" }}>
                      <ArrowUpRight size={14} style={{ color: "var(--bg)" }} />
                    </div>
                  </div>

                  {/* Bottom info panel */}
                  <div className="flex items-center justify-between px-5 py-4"
                    style={{ borderTop: "1px solid var(--border)" }}>
                    <div>
                      <h3
                        className="text-base font-normal transition-colors duration-300 group-hover:text-gold"
                        style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}
                      >
                        {cat.name}
                      </h3>
                      <p className="text-xs tracking-[0.2em] uppercase mt-1" style={{ color: "var(--cream-dim)" }}>
                        {cat.product_count} {cat.product_count === 1 ? "piece" : "pieces"}
                      </p>
                    </div>

                    {/* Gold dot indicator */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:w-5"
                        style={{ background: "var(--gold)" }} />
                      <div className="w-1.5 h-1.5 rounded-full opacity-30" style={{ background: "var(--gold)" }} />
                      <div className="w-1.5 h-1.5 rounded-full opacity-20" style={{ background: "var(--gold)" }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

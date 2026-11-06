import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Droplets, Sparkles } from "lucide-react";
import { productService } from "../services/productService";

// Homepage spotlight for the category starred as Featured in Admin -> Categories.
// Shows only while that category is visible; the image comes from the category's
// uploaded image, with a decorative placeholder until one is added.
export default function FeaturedCollectionSpotlight() {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    productService.getCategories()
      .then(({ data }) => {
        const cat = (Array.isArray(data) ? data : []).find(c => c.is_featured);
        setCategory(cat || null);
      })
      .catch(() => setCategory(null));
  }, []);

  if (!category) return null;

  const count = category.product_count || 0;
  const SHOP_LINK = `/shop?category=${category.slug}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Pulsing golden glow, same treatment as the Rakhi banner */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0px rgba(200,164,92,0)",
              "0 0 32px rgba(200,164,92,0.45)",
              "0 0 0px rgba(200,164,92,0)",
            ],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="grid grid-cols-1 lg:grid-cols-[5fr_7fr]"
          style={{ border: "1px solid var(--gold)", background: "var(--bg-card)" }}
        >
          {/* Image — portrait (4:5) to suit product photos */}
          <Link to={SHOP_LINK} className="group relative block overflow-hidden" style={{ aspectRatio: "4/5", background: "var(--bg-2)" }}>
            {category.image_url ? (
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative"
                style={{ background: "radial-gradient(circle at 30% 30%, rgba(200,164,92,0.18), transparent 60%), radial-gradient(circle at 75% 70%, rgba(200,164,92,0.12), transparent 55%)" }}>
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute"
                    style={{ left: `${12 + i * 15}%`, top: "-10%", color: "var(--gold)", opacity: 0.35 }}
                    animate={{ y: ["0%", "1100%"], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.6, ease: "easeIn" }}
                  >
                    <Droplets size={14} />
                  </motion.span>
                ))}
                <Droplets size={56} style={{ color: "var(--gold)", opacity: 0.55 }} />
              </div>
            )}

            {/* Shimmer sweep */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)" }}
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            />

            <span className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase"
              style={{ background: "var(--gold)", color: "var(--bg)" }}>
              <Sparkles size={11} /> New
            </span>
          </Link>

          {/* Text */}
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-10 lg:p-14 border-t lg:border-t-0 lg:border-l"
            style={{ borderColor: "var(--border)" }}>
            <p className="section-tag">Featured Collection</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              {category.name}
            </h2>
            {category.description && (
              <p className="text-sm leading-relaxed max-w-md" style={{ color: "var(--cream-dim)" }}>
                {category.description}
              </p>
            )}
            <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--gold)" }}>
              {count > 0 ? `${count} ${count === 1 ? "variant" : "variants"}` : "Launching soon"}
            </p>
            <div>
              <Link to={SHOP_LINK} className="btn-gold inline-flex items-center gap-2">
                Shop the Collection <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CDN = "https://res.cloudinary.com/dilo6efzb/image/upload/threadtales/products";

const COLLECTIONS = [
  { slug: "thread-bangles",    name: "Thread Bangles",    count: "24 pieces", image: `${CDN}/pink_royal_thread_bangle_set.jpg` },
  { slug: "bridal-bangle-sets",name: "Bridal Sets",       count: "20 pieces", image: `${CDN}/bridal_set_3.jpg` },
  { slug: "invisible-chains",  name: "Invisible Chains",  count: "16 pieces", image: `${CDN}/invisible%20chain%206.jpg` },
  { slug: "hair-accessories",  name: "Hair Accessories",  count: "9 pieces",  image: `${CDN}/hair_clip_5.jpg` },
  { slug: "chains",            name: "Chains",            count: "4 pieces",  image: `${CDN}/chiain-set.png` },
  { slug: "saree-pins",        name: "Saree Pins",        count: "1 piece",   image: `${CDN}/saree_pin.jpg` },
];

const MARQUEE_TEXT = ["Thread Bangles", "Bridal Sets", "Invisible Chains", "Hair Accessories", "Chains", "Saree Pins"];

export default function CollectionSection() {
  return (
    <section className="py-16 lg:py-32" style={{ background: "var(--bg)" }}>

      {/* Marquee strip */}
      <div className="overflow-hidden border-y py-4 mb-20" style={{ borderColor: "var(--border)" }}>
        <div className="marquee-track">
          {[...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT].map((text, i) => (
            <span key={i} className="flex items-center gap-6 px-8 text-sm tracking-[0.25em] uppercase"
              style={{ color: i % 2 === 0 ? "var(--gold)" : "var(--cream-dim)" }}>
              {text}
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--gold)" }} />
            </span>
          ))}
        </div>
      </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {COLLECTIONS.map((col, i) => (
            <motion.div
              key={col.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/shop?category=${col.slug}`}
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
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ transform: "scale(1)", transition: "transform 0.7s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
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
                      {col.name}
                    </h3>
                    <p className="text-xs tracking-[0.2em] uppercase mt-1" style={{ color: "var(--cream-dim)" }}>
                      {col.count}
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
          ))}
        </div>
      </div>
    </section>
  );
}

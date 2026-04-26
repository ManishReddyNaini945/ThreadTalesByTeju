import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Heart, Award } from "lucide-react";

const CDN = "https://res.cloudinary.com/dilo6efzb/image/upload/threadtales/products";

const PILLARS = [
  { icon: Heart, title: "Made with Love", desc: "Every piece is hand-stitched with care, carrying the warmth of the maker." },
  { icon: Sparkles, title: "Premium Quality", desc: "We source the finest threads and materials for long-lasting beauty." },
  { icon: Award, title: "Unique Designs", desc: "No two pieces are exactly alike — each carries its own personality." },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — Image composition */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/5", border: "1px solid var(--border)" }}>
              <img
                src={`${CDN}/making_image.png`}
                alt="Handcrafting jewelry"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(135deg, rgba(12,10,9,0.3) 0%, transparent 60%)" }} />
            </div>

            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 p-5 w-48"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <p className="text-3xl font-normal mb-1" style={{ fontFamily: "Playfair Display, serif", color: "var(--gold)" }}>
                5+
              </p>
              <p className="text-xs tracking-wider leading-relaxed" style={{ color: "var(--cream-dim)" }}>
                Years of handcrafting beautiful jewelry
              </p>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border opacity-20"
              style={{ borderColor: "var(--gold)" }} />
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-tag mb-6">Our Story</p>
            <h2 className="section-title mb-8">
              Jewellery Born<br />
              from Passion
            </h2>

            <p className="text-base leading-relaxed mb-5" style={{ color: "var(--cream-dim)" }}>
              Thread Tales by Teju began with a simple dream — to create jewelry that feels as beautiful
              as it looks. Each collection is born from a deep love for handcraft, color, and the
              timeless art of thread work.
            </p>
            <p className="text-base leading-relaxed mb-12" style={{ color: "var(--cream-dim)" }}>
              From delicate hair clips to grand bridal sets, every piece is crafted by hand,
              carrying the soul of the artisan who made it. We believe jewelry should tell your story.
            </p>

            {/* Pillars */}
            <div className="flex flex-col gap-6 mb-12">
              {PILLARS.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ border: "1px solid var(--border)" }}>
                    <Icon size={16} style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: "var(--cream)" }}>{title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--cream-dim)" }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/shop" className="btn-outline">
              Discover Our Work
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

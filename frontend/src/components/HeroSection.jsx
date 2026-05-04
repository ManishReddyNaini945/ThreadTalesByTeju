import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const CDN = "https://res.cloudinary.com/dilo6efzb/image/upload/threadtales/products";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const STATS = [
  { num: "74+", label: "Unique Products" },
  { num: "6", label: "Collections" },
  { num: "100%", label: "Handcrafted" },
];

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: "var(--bg)" }}>

      {/* ── MOBILE HERO (hidden on lg+) ───────────────────────────── */}
      <div className="lg:hidden flex flex-col min-h-screen">

        {/* Full-bleed image with text overlay */}
        <div className="relative flex-1" style={{ minHeight: "65vh" }}>
          {/* Background gradient orbs */}
          <motion.div
            style={{ background: "radial-gradient(circle, #c8a45c 0%, transparent 70%)" }}
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[80px] pointer-events-none"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* Hero image */}
          <img
            src={`${CDN}/thread_bangle_15.jpg`}
            alt="Vibrant Thread Bangles"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Bottom-to-top gradient — darkens lower half for text */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(12,10,9,1) 0%, rgba(12,10,9,0.7) 45%, rgba(12,10,9,0.15) 75%, transparent 100%)",
            }}
          />

          {/* Top-to-bottom gradient — darkens navbar area so logo/icons are always readable */}
          <div
            className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(12,10,9,0.75) 0%, transparent 100%)",
            }}
          />

          {/* Top badge — pushed below the navbar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute top-[72px] left-5 flex items-center gap-2"
          >
            <span className="gold-line" />
            <span className="section-tag flex items-center gap-1.5">
              <Sparkles size={10} /> Handcrafted with Love
            </span>
          </motion.div>

          {/* Bottom text over image */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="absolute bottom-0 left-0 right-0 px-5 pb-6"
          >
            <motion.h1
              variants={fadeUp}
              className="font-normal leading-[1.05] mb-3"
              style={{
                fontFamily: "Playfair Display, serif",
                color: "var(--cream)",
                fontSize: "clamp(2.4rem, 9vw, 3.5rem)",
              }}
            >
              Where Every Thread Tells{" "}
              <em className="not-italic" style={{ color: "var(--gold)" }}>a Story</em>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-sm leading-relaxed mb-5"
              style={{ color: "rgba(247,245,242,0.75)" }}
            >
              Exquisite handcrafted jewelry — bangles, bridal sets, chains & more. Each piece made with love.
            </motion.p>

            {/* CTA buttons stacked on mobile */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              <Link to="/shop" className="btn-gold flex items-center justify-center gap-2 py-4">
                Explore Collection
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/shop?is_bestseller=true"
                className="btn-outline flex items-center justify-center py-4"
                style={{ backdropFilter: "blur(8px)" }}
              >
                Our Bestsellers
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex items-center justify-around px-5 py-6"
          style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="text-center">
              <p className="text-2xl font-normal" style={{ fontFamily: "Playfair Display, serif", color: "var(--gold)" }}>
                {s.num}
              </p>
              <p className="text-[10px] tracking-wider mt-1" style={{ color: "var(--cream-dim)" }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── DESKTOP HERO (hidden below lg) ───────────────────────── */}
      <div className="hidden lg:block">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            style={{ y, background: "radial-gradient(circle, #c8a45c 0%, transparent 70%)" }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px]"
            initial={{ opacity: 0.08 }}
            animate={{ opacity: [0.08, 0.13, 0.08] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <div
            className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #c9908a 0%, transparent 70%)" }}
          />
        </div>

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(var(--cream) 1px, transparent 1px), linear-gradient(90deg, var(--cream) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-10 w-full pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">

            {/* Left — Text */}
            <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col justify-center">

              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
                <span className="gold-line" />
                <span className="section-tag flex items-center gap-2">
                  <Sparkles size={11} />
                  Handcrafted with Love
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp}
                className="text-[clamp(3rem,7vw,5.5rem)] font-normal leading-[1.05] mb-6"
                style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                Where Every<br />
                Thread Tells<br />
                <em className="not-italic" style={{ color: "var(--gold)" }}>a Story</em>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-base leading-relaxed mb-10 max-w-md"
                style={{ color: "var(--cream-dim)" }}>
                Discover exquisite handcrafted jewelry — thread bangles, bridal sets, invisible chains,
                and more. Each piece is a labor of love, made to adorn your most precious moments.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
                <Link to="/shop" className="btn-gold flex items-center gap-2">
                  Explore Collection
                  <ArrowRight size={15} />
                </Link>
                <Link to="/shop?is_bestseller=true" className="btn-outline">
                  Our Bestsellers
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-10 mt-14 pt-10 border-t"
                style={{ borderColor: "var(--border)" }}>
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-normal"
                      style={{ fontFamily: "Playfair Display, serif", color: "var(--gold)" }}>
                      {s.num}
                    </p>
                    <p className="text-xs tracking-wider mt-1" style={{ color: "var(--cream-dim)" }}>{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Single stunning image */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-sm lg:max-w-md">

                {/* Decorative gold border frame (offset) */}
                <div className="absolute -top-4 -left-4 right-4 bottom-4 pointer-events-none"
                  style={{ border: "1px solid var(--gold)", opacity: 0.3 }} />

                {/* Main image */}
                <div className="relative overflow-hidden"
                  style={{ aspectRatio: "3/4", border: "1px solid var(--border)" }}>
                  <img
                    src={`${CDN}/thread_bangle_15.jpg`}
                    alt="Vibrant Thread Bangles"
                    className="w-full h-full object-cover"
                    style={{ transition: "transform 8s ease", transform: "scale(1.05)" }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(12,10,9,0.75) 0%, transparent 55%)" }} />

                  {/* Product badge */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[10px] tracking-[0.3em] uppercase mb-1.5" style={{ color: "var(--gold)" }}>
                      ✦ Featured Collection
                    </p>
                    <p className="text-xl font-normal leading-snug"
                      style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                      Vibrant Thread Bangles
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-base" style={{ color: "var(--gold)" }}>₹649</span>
                      <span className="w-px h-3 opacity-30" style={{ background: "var(--cream)" }} />
                      <Link to="/shop?category=thread-bangles"
                        className="text-[10px] tracking-widest uppercase flex items-center gap-1"
                        style={{ color: "var(--cream-dim)" }}>
                        Shop Now <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom floating info card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: [0.45, 0, 0.55, 1], repeatType: "mirror" }}
                  className="absolute -bottom-6 -right-6 px-5 py-4 flex items-center gap-3"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--gold)", minWidth: 160 }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }} />
                  <div>
                    <p className="text-[10px] tracking-widest uppercase" style={{ color: "var(--cream-dim)" }}>
                      New Arrival
                    </p>
                    <p className="text-sm font-normal mt-0.5"
                      style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
                      Bridal Sets
                    </p>
                  </div>
                </motion.div>

                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full border opacity-15"
                  style={{ borderColor: "var(--gold)" }} />
                <div className="absolute top-1/2 -right-12 w-4 h-4 rounded-full"
                  style={{ background: "var(--gold)", opacity: 0.4 }} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--cream-dim)" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, var(--gold), transparent)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

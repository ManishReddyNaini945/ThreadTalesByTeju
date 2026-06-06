import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfferBanner() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <>
          {/* Fixed banner — sits right below the fixed navbar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed left-0 right-0 z-40"
            /* navbar is h-14 (mobile) / h-20 (sm) / h-24 (lg) */
            style={{
              top: "3.5rem",           /* 56px = h-14 on mobile */
              background: "linear-gradient(90deg, var(--bg) 0%, #1e1912 30%, #1e1912 70%, var(--bg) 100%)",
              borderBottom: "1px solid rgba(200,164,92,0.25)",
              borderTop: "1px solid rgba(200,164,92,0.1)",
            }}
          >
            {/* sm override via inline media — use a wrapper div trick with Tailwind classes */}
            <div className="relative flex items-center justify-center gap-3 px-10 py-2">

              {/* Left gold line */}
              <span className="hidden sm:block absolute left-8 h-px w-12 opacity-40"
                style={{ background: "linear-gradient(to right, transparent, var(--gold))" }} />

              {/* Sparkle left */}
              <Sparkles size={10} className="flex-shrink-0 hidden sm:block"
                style={{ color: "var(--gold)", opacity: 0.6 }} />

              {/* Tag icon */}
              <Tag size={11} className="flex-shrink-0" style={{ color: "var(--gold)" }} />

              {/* Offer text */}
              <p className="text-[11px] sm:text-xs tracking-wide text-center leading-relaxed select-none"
                style={{ color: "var(--cream-dim)" }}>
                <span className="font-bold tracking-widest" style={{ color: "var(--gold)" }}>
                  15% OFF + FREE SHIPPING
                </span>
                <span className="mx-1.5 opacity-30">·</span>
                <span>on orders above </span>
                <span className="font-semibold" style={{ color: "var(--cream)" }}>₹999</span>
                <span className="hidden sm:inline"> — applied automatically at checkout</span>
                <span className="mx-1.5 opacity-30">·</span>
                <Link
                  to="/shop"
                  className="font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "var(--gold)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  Shop Now →
                </Link>
              </p>

              {/* Sparkle right */}
              <Sparkles size={10} className="flex-shrink-0 hidden sm:block"
                style={{ color: "var(--gold)", opacity: 0.6 }} />

              {/* Right gold line */}
              <span className="hidden sm:block absolute right-8 h-px w-12 opacity-40"
                style={{ background: "linear-gradient(to left, transparent, var(--gold))" }} />

              {/* Dismiss */}
              <button
                onClick={() => setDismissed(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center transition-opacity opacity-30 hover:opacity-80"
                aria-label="Dismiss offer"
              >
                <X size={11} style={{ color: "var(--cream-dim)" }} />
              </button>
            </div>
          </motion.div>

          {/* Spacer so page content isn't hidden behind the banner (~36px banner height) */}
          {/* This pairs with the navbar spacer already present in each page */}
          <div className="h-9" />
        </>
      )}
    </AnimatePresence>
  );
}

import React from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { Instagram } from "lucide-react";

const instagramHandle = "@thread_tales_by_teju";
const instagramUrl = "https://instagram.com/thread_tales_by_teju";

export const GallerySection = () => {
  const [titleRef, titleVisible] = useScrollAnimation();

  return (
    <section id="gallery" className="relative py-28 md:py-36 bg-brand-darker overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={titleRef} className={`mb-16 text-center transition-all duration-700 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-brand-gold/60" />
            <span className="text-brand-gold/80 text-xs tracking-[0.3em] uppercase font-body font-medium">Gallery</span>
            <div className="w-8 h-[1px] bg-brand-gold/60" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brand-cream leading-tight mb-4">Our World</h2>
          <p className="font-body text-lg text-brand-cream/50 max-w-lg mx-auto">Designed for weddings, festivals, and everyday elegance.</p>
        </div>

        <div className="text-center">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-brand-gold/20 hover:border-brand-gold/40 rounded-full transition-all duration-300 hover:bg-brand-gold/5">
            <Instagram size={18} className="text-brand-gold/70 group-hover:text-brand-gold transition-colors duration-300" />
            <span className="font-body text-sm text-brand-cream/70 group-hover:text-brand-cream tracking-wide transition-colors duration-300">
              Follow us {instagramHandle}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

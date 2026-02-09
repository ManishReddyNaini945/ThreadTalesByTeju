import React from "react";
import { heroData } from "../data/mock";
import { useParallax } from "../hooks/useScrollAnimation";
import { ChevronDown, Sparkles, HandHeart, PartyPopper, Flag } from "lucide-react";

const trustIcons = {
  Handmade: HandHeart,
  "Custom Orders": Sparkles,
  "Festive & Bridal": PartyPopper,
  "Made in India": Flag,
};

export const HeroSection = () => {
  const scrollOffset = useParallax();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${scrollOffset * 0.25}px)` }}
      >
        <img
          src={heroData.backgroundImage}
          alt="Handcrafted bangles"
          className="w-full h-[120%] object-cover object-center"
          loading="eager"
        />
        {/* Dark overlay with warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-darker/80 via-brand-darker/60 to-brand-darker/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-darker/50 to-transparent" />
      </div>

      {/* Gold decorative line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Small Decorative Label */}
          <div className="hero-fade-up flex items-center gap-3 mb-8" style={{ animationDelay: "0.3s" }}>
            <div className="w-10 h-[1px] bg-brand-gold/60" />
            <span className="text-brand-gold/80 text-xs tracking-[0.3em] uppercase font-body font-medium">
              Handcrafted with Love
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-fade-up font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-brand-cream leading-[1.05] mb-6"
            style={{ animationDelay: "0.5s" }}
          >
            {heroData.headline.split(" ").map((word, i) => (
              <span key={i} className={i === 1 ? "text-brand-gold italic" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p
            className="hero-fade-up font-body text-lg md:text-xl text-brand-cream/70 max-w-xl leading-relaxed mb-10"
            style={{ animationDelay: "0.7s" }}
          >
            {heroData.subheadline}
          </p>

          {/* CTAs */}
          <div className="hero-fade-up flex flex-col sm:flex-row gap-4 mb-14" style={{ animationDelay: "0.9s" }}>
            <a
              href={heroData.ctas[0].href}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(heroData.ctas[0].href)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative overflow-hidden px-8 py-4 bg-brand-gold text-brand-darker font-body font-semibold text-sm tracking-wide rounded transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/20 text-center"
            >
              <span className="relative z-10">{heroData.ctas[0].label}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-gold-light to-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </a>
            <a
              href={heroData.ctas[1].href}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(heroData.ctas[1].href)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group px-8 py-4 border border-brand-gold/30 text-brand-cream font-body font-medium text-sm tracking-wide rounded hover:border-brand-gold/60 hover:bg-brand-gold/5 transition-all duration-300 text-center"
            >
              {heroData.ctas[1].label}
            </a>
          </div>

          {/* Trust Chips */}
          <div className="hero-fade-up flex flex-wrap gap-3" style={{ animationDelay: "1.1s" }}>
            {heroData.trustChips.map((chip) => {
              const IconComp = trustIcons[chip];
              return (
                <span
                  key={chip}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/15 bg-brand-gold/5 text-brand-cream/60 text-xs font-body tracking-wide backdrop-blur-sm"
                >
                  {IconComp && <IconComp size={13} className="text-brand-gold/70" />}
                  {chip}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 hero-fade-up" style={{ animationDelay: "1.4s" }}>
        <span className="text-brand-cream/30 text-xs font-body tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} className="text-brand-gold/40 animate-bounce" />
      </div>
    </section>
  );
};

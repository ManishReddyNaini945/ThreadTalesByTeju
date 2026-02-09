import React from "react";
import { aboutData } from "../data/mock";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { Gem, Palette, Sparkles } from "lucide-react";
import { Separator } from "./ui/separator";

const iconMap = {
  Gem: Gem,
  Palette: Palette,
  Sparkles: Sparkles,
};

export const AboutSection = () => {
  const [titleRef, titleVisible] = useScrollAnimation();
  const [contentRef, contentVisible] = useScrollAnimation({ rootMargin: "0px 0px -40px 0px" });
  const [pillarsRef, pillarsVisible] = useScrollAnimation({ rootMargin: "0px 0px -40px 0px" });

  return (
    <section id="about" className="relative py-28 md:py-36 bg-brand-cream overflow-hidden">
      {/* Subtle decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div
          ref={titleRef}
          className={`mb-20 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-brand-gold/60" />
            <span className="text-brand-gold text-xs tracking-[0.3em] uppercase font-body font-medium">
              Our Story
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight">
            {aboutData.title}
          </h2>
        </div>

        {/* Content Grid */}
        <div
          ref={contentRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-24 transition-all duration-700 delay-200 ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Image */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-sm">
              <img
                src={aboutData.image}
                alt="Artisan crafting bangles"
                className="w-full h-[450px] md:h-[550px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 to-transparent" />
            </div>
            {/* Decorative border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-brand-gold/20 rounded-sm -z-10" />
          </div>

          {/* Text */}
          <div>
            <p className="font-body text-lg md:text-xl text-brand-dark/80 leading-relaxed mb-8">
              {aboutData.description}
            </p>
            <Separator className="my-8 bg-brand-gold/20" />
            <blockquote className="relative pl-6 border-l-2 border-brand-gold/40">
              <p className="font-serif text-lg italic text-brand-dark/70 leading-relaxed mb-4">
                "{aboutData.founderNote}"
              </p>
              <cite className="not-italic font-body text-sm text-brand-gold font-medium tracking-wider uppercase">
                — {aboutData.founder}, Founder
              </cite>
            </blockquote>
          </div>
        </div>

        {/* Value Pillars */}
        <div
          ref={pillarsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 transition-all duration-700 delay-300 ${
            pillarsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {aboutData.pillars.map((pillar, index) => {
            const IconComp = iconMap[pillar.icon];
            return (
              <div
                key={pillar.title}
                className="group p-8 bg-white rounded-sm border border-brand-dark/5 hover:border-brand-gold/20 transition-all duration-500 hover:shadow-lg hover:shadow-brand-gold/5"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-gold/10 mb-6 group-hover:bg-brand-gold/15 transition-colors duration-300">
                  {IconComp && <IconComp size={22} className="text-brand-gold" />}
                </div>
                <h3 className="font-serif text-xl font-semibold text-brand-dark mb-3">
                  {pillar.title}
                </h3>
                <p className="font-body text-sm text-brand-dark/60 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

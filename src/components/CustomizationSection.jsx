import React from "react";
import { customizationSteps, whatsappURL } from "../data/mock";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { MessageCircle, Palette, Hand, Gift, ArrowRight } from "lucide-react";

const iconMap = {
  MessageCircle: MessageCircle,
  Palette: Palette,
  Hand: Hand,
  Gift: Gift,
};

export const CustomizationSection = () => {
  const [titleRef, titleVisible] = useScrollAnimation();
  const [stepsRef, stepsVisible] = useScrollAnimation({ rootMargin: "0px 0px -40px 0px" });

  return (
    <section id="customize" className="relative py-28 md:py-36 bg-brand-cream overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div
          ref={titleRef}
          className={`mb-20 text-center transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-brand-gold/60" />
            <span className="text-brand-gold text-xs tracking-[0.3em] uppercase font-body font-medium">
              Made For You
            </span>
            <div className="w-8 h-[1px] bg-brand-gold/60" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight mb-4">
            Your Vision, Our Craft
          </h2>
          <p className="font-body text-lg text-brand-dark/50 max-w-lg mx-auto">
            From your imagination to a handcrafted masterpiece in four simple steps
          </p>
        </div>

        {/* Steps Timeline */}
        <div
          ref={stepsRef}
          className={`relative transition-all duration-700 delay-200 ${
            stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Desktop Timeline Line */}
          <div className="hidden md:block absolute top-[60px] left-[calc(12.5%)] right-[calc(12.5%)] h-[1px] bg-brand-gold/15" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {customizationSteps.map((step, index) => {
              const IconComp = iconMap[step.icon];
              return (
                <div
                  key={step.step}
                  className="relative flex flex-col items-center text-center group"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Step Number Circle */}
                  <div className="relative z-10 mb-6">
                    <div className="w-[72px] h-[72px] rounded-full border-2 border-brand-gold/20 bg-white flex items-center justify-center group-hover:border-brand-gold/50 group-hover:shadow-lg group-hover:shadow-brand-gold/10 transition-all duration-500">
                      {IconComp && (
                        <IconComp
                          size={26}
                          className="text-brand-gold/70 group-hover:text-brand-gold transition-colors duration-300"
                        />
                      )}
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center rounded-full bg-brand-darker text-brand-gold text-xs font-body font-semibold">
                      {step.step}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-lg font-semibold text-brand-dark mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-brand-dark/50 leading-relaxed max-w-[240px]">
                    {step.description}
                  </p>

                  {/* Arrow between steps (mobile) */}
                  {index < customizationSteps.length - 1 && (
                    <div className="md:hidden my-4">
                      <ArrowRight size={16} className="text-brand-gold/30 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <a
            href={`${whatsappURL}?text=${encodeURIComponent("Hi! I'd like to discuss a custom order.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 overflow-hidden px-10 py-4 bg-brand-darker text-brand-cream font-body font-medium text-sm tracking-wide rounded transition-all duration-300 hover:shadow-lg hover:shadow-brand-darker/30"
          >
            <MessageCircle size={16} className="text-brand-gold" />
            <span>Message on WhatsApp</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent" />
          </a>
        </div>
      </div>
    </section>
  );
};

import React from "react";
import { contactData, whatsappURL, whatsappNumber } from "../data/mock";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { Instagram, MessageCircle, Phone, ArrowUpRight } from "lucide-react";

export const ContactSection = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation();

  return (
    <section id="contact" className="relative py-28 md:py-36 bg-brand-darker overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/3 rounded-full blur-[120px] pointer-events-none" />

      <div
        ref={sectionRef}
        className={`max-w-4xl mx-auto px-6 lg:px-10 text-center transition-all duration-700 ${
          sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-brand-gold/60" />
          <span className="text-brand-gold/80 text-xs tracking-[0.3em] uppercase font-body font-medium">
            Get In Touch
          </span>
          <div className="w-8 h-[1px] bg-brand-gold/60" />
        </div>

        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brand-cream leading-tight mb-6">
          Let's Create Something{" "}
          <span className="text-brand-gold italic">Beautiful</span>
        </h2>

        <p className="font-body text-lg text-brand-cream/50 max-w-xl mx-auto mb-12">
          {contactData.tagline}. Every piece starts with a conversation.
        </p>

        {/* Order Now Panel */}
        <div className="relative mx-auto max-w-2xl p-8 md:p-12 border border-brand-gold/15 rounded-sm bg-brand-darker/50 backdrop-blur-sm mb-12">
          {/* Gold corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-brand-gold/30" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-brand-gold/30" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-brand-gold/30" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-brand-gold/30" />

          {/* Subtle glow */}
          <div className="absolute inset-0 rounded-sm shadow-[inset_0_0_60px_rgba(200,164,92,0.03)]" />

          <h3 className="relative font-serif text-2xl md:text-3xl font-semibold text-brand-cream mb-4">
            Ready to Order?
          </h3>
          <p className="relative font-body text-sm text-brand-cream/50 mb-8 max-w-md mx-auto">
            Message us on WhatsApp to place your order, request customization, or learn more about our collections.
          </p>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`${whatsappURL}?text=${encodeURIComponent("Hi! I'd like to know more about your products.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-gold text-brand-darker font-body font-semibold text-sm tracking-wide rounded transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/20"
            >
              <MessageCircle size={16} />
              <span className="relative z-10">Order on WhatsApp</span>
              <ArrowUpRight size={14} className="relative z-10" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </a>
            <a
              href={`tel:${contactData.whatsapp}`}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border border-brand-gold/25 text-brand-cream font-body font-medium text-sm tracking-wide rounded hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all duration-300"
            >
              <Phone size={16} className="text-brand-gold/70" />
              <span>Call Us</span>
            </a>
          </div>
        </div>

        {/* Social Handles */}
        <div className="flex items-center justify-center gap-6">
          <a
            href={contactData.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-cream/40 hover:text-brand-gold transition-colors duration-300"
          >
            <Instagram size={16} />
            <span className="font-body text-sm">{contactData.instagram}</span>
          </a>
          <span className="text-brand-cream/10">|</span>
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-cream/40 hover:text-brand-gold transition-colors duration-300"
          >
            <MessageCircle size={16} />
            <span className="font-body text-sm">WhatsApp Us</span>
          </a>
        </div>
      </div>
    </section>
  );
};

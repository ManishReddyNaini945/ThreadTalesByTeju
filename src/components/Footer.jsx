import React from "react";
import { footerData } from "../data/mock";
import { Instagram, Heart } from "lucide-react";
import { Separator } from "./ui/separator";

export const Footer = () => {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-brand-dark py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl font-semibold text-brand-cream mb-3">
              {footerData.brand}
            </h3>
            <p className="font-body text-sm text-brand-cream/40 leading-relaxed max-w-xs">
              {footerData.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="font-body text-xs text-brand-gold/80 tracking-[0.2em] uppercase mb-5 font-medium">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerData.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="font-body text-sm text-brand-cream/50 hover:text-brand-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-1">
            <h4 className="font-body text-xs text-brand-gold/80 tracking-[0.2em] uppercase mb-5 font-medium">
              Connect
            </h4>
            <a
              href="https://instagram.com/thread_tales_by_teju"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-brand-cream/50 hover:text-brand-gold transition-colors duration-300 mb-4"
            >
              <Instagram size={18} />
              <span className="font-body text-sm">@thread_tales_by_teju</span>
            </a>
            <p className="font-body text-xs text-brand-cream/30 leading-relaxed">
              DM us for custom orders, bulk enquiries, and collaborations.
            </p>
          </div>
        </div>

        <Separator className="bg-brand-cream/5 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-brand-cream/30">
            {footerData.copyright}
          </p>
          <p className="font-body text-xs text-brand-cream/20 inline-flex items-center gap-1">
            Made with <Heart size={10} className="text-brand-gold/40" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

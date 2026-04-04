import React from "react";
import { useNavigate } from "react-router-dom";
import { collectionData } from "../data/mock";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { ArrowRight } from "lucide-react";

export const CollectionSection = () => {
  const [titleRef, titleVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation({ rootMargin: "0px 0px -40px 0px" });
  const navigate = useNavigate();

  return (
    <section id="collection" className="relative py-28 md:py-36 bg-brand-darker overflow-hidden">
      {/* Decorative gold line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div
          ref={titleRef}
          className={`mb-16 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-brand-gold/60" />
            <span className="text-brand-gold/80 text-xs tracking-[0.3em] uppercase font-body font-medium">
              Explore
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brand-cream leading-tight mb-4">
            {collectionData.title}
          </h2>
          <p className="font-body text-lg text-brand-cream/50 max-w-lg">
            {collectionData.subtitle}
          </p>
        </div>

        {/* Collection Grid */}
        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
            gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {collectionData.categories.map((category, index) => (
            <div
              key={category.id}
              className={`group relative overflow-hidden rounded-sm ${
                index === 0 ? "md:col-span-2 lg:col-span-2" : ""
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className={`relative overflow-hidden ${index === 0 ? "h-[350px] md:h-[400px]" : "h-[300px] md:h-[350px]"}`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                {/* Gold border on hover */}
                <div className="absolute inset-0 border border-transparent group-hover:border-brand-gold/30 transition-all duration-500 rounded-sm" />
                

              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-semibold text-brand-cream mb-2 group-hover:text-brand-gold transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="font-body text-sm text-brand-cream/50 max-w-xs leading-relaxed mb-3 hidden md:block">
                      {category.description}
                    </p>
                    <span className="inline-block font-body text-xs text-brand-gold/80 tracking-wider">
                      {category.priceRange}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/collection/${category.id}`)}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-gold/20 group-hover:border-brand-gold/50 group-hover:bg-brand-gold/10 transition-all duration-300"
                  >
                    <ArrowRight size={16} className="text-brand-gold/60 group-hover:text-brand-gold transition-colors duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

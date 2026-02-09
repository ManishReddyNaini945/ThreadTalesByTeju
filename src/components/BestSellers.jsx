import React from "react";
import { bestSellersData } from "../data/mock";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { Badge } from "./ui/badge";
import { Heart, ShoppingBag } from "lucide-react";

export const BestSellers = () => {
  const [titleRef, titleVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation({ rootMargin: "0px 0px -40px 0px" });

  return (
    <section id="bestsellers" className="relative py-28 md:py-36 bg-brand-cream overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div
          ref={titleRef}
          className={`mb-16 text-center transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-brand-gold/60" />
            <span className="text-brand-gold text-xs tracking-[0.3em] uppercase font-body font-medium">
              Best Sellers
            </span>
            <div className="w-8 h-[1px] bg-brand-gold/60" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight mb-4">
            {bestSellersData.title}
          </h2>
          <p className="font-body text-lg text-brand-dark/50 max-w-lg mx-auto">
            {bestSellersData.subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div
          ref={gridRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${
            gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {bestSellersData.products.map((product, index) => (
            <div
              key={product.id}
              className={`group relative bg-white rounded-sm overflow-hidden border border-brand-dark/5 hover:border-brand-gold/25 transition-all duration-500 hover:shadow-xl hover:shadow-brand-gold/8 ${
                index >= 3 ? "sm:col-span-1 lg:col-span-1" : ""
              } ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden h-[280px] md:h-[320px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-brand-darker/80 text-brand-gold border-brand-gold/20 font-body text-xs tracking-wide backdrop-blur-sm hover:bg-brand-darker/80">
                    {product.badge}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-brand-gold/10 border border-brand-dark/5 transition-all duration-300">
                    <Heart size={15} className="text-brand-dark/60" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-lg font-semibold text-brand-dark mb-2 group-hover:text-brand-gold/90 transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="font-body text-sm text-brand-dark/50 leading-relaxed mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xl font-semibold text-brand-dark">
                    {product.price}
                  </span>
                  <button
                    onClick={() => {
                      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group/btn inline-flex items-center gap-2 px-4 py-2 bg-brand-darker text-brand-cream font-body text-xs tracking-wide rounded hover:bg-brand-gold hover:text-brand-darker transition-all duration-300"
                  >
                    <ShoppingBag size={13} />
                    DM to Order
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

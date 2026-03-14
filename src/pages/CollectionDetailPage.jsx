import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collectionProducts } from "../data/collectionProducts";
import { whatsappNumber } from "../data/mock";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { ArrowLeft, MessageCircle, Heart, ShoppingBag } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const CollectionDetailPage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [titleRef, titleVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation({ rootMargin: "0px 0px -40px 0px" });

  const collection = collectionProducts[collectionId];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [collectionId]);

  if (!collection) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-brand-dark mb-4">Collection Not Found</h2>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-darker text-brand-cream font-body text-sm tracking-wide rounded hover:bg-brand-gold hover:text-brand-darker transition-all duration-300"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 mb-8 text-brand-dark/60 hover:text-brand-gold transition-colors duration-300"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-body text-sm">Back to Collections</span>
          </button>

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
                Collection
              </span>
              <div className="w-8 h-[1px] bg-brand-gold/60" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight mb-4">
              {collection.name}
            </h1>
            <p className="font-body text-lg text-brand-dark/50 max-w-lg mx-auto">
              Explore our curated selection of {collection.name.toLowerCase()}
            </p>
          </div>

          {/* Products Grid */}
          <div
            ref={gridRef}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${
              gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {collection.products.map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-sm overflow-hidden border border-brand-dark/5 hover:border-brand-gold/25 transition-all duration-500 hover:shadow-xl hover:shadow-brand-gold/8"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-[350px] md:h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Order Button - appears on hover over image */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 z-10">
                    <button
                      onClick={() => {
                        const message = `Hi! I'm interested in ordering:\n\n*${product.name}*\nPrice: ${product.price}\n${product.description}\n\n📷 Product Image: ${window.location.origin}${product.image}\n\nPlease share more details.`;
                        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-darker font-body font-semibold text-sm tracking-wide rounded hover:bg-brand-gold/90 transition-all duration-300 shadow-lg"
                    >
                      <MessageCircle size={16} />
                      Order on WhatsApp
                    </button>
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
                        const message = `Hi! I'm interested in ordering:\n\n*${product.name}*\nPrice: ${product.price}\n\n📷 Product Image: ${window.location.origin}${product.image}\n\nPlease share more details.`;
                        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="group/btn inline-flex items-center gap-2 px-4 py-2 bg-brand-darker text-brand-cream font-body text-xs tracking-wide rounded hover:bg-brand-gold hover:text-brand-darker transition-all duration-300"
                    >
                      <ShoppingBag size={13} />
                      Order on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

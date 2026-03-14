import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collectionProducts } from "../data/collectionProducts";
import { whatsappNumber } from "../data/mock";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const CollectionDetailPage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
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
          <div className="mb-16 text-center">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {collection.products.map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-sm overflow-hidden border border-brand-dark/5 hover:border-brand-gold/25 transition-all duration-500 hover:shadow-xl hover:shadow-brand-gold/8"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-square bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Order Button */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                    <button
                      onClick={() => {
                        const message = `Hi! I'm interested in ordering:\n\n*${product.name}*\nPrice: ${product.price}\n${product.description}\n\n📷 Product Image: ${window.location.origin}${product.image}\n\nPlease share more details.`;
                        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-brand-gold text-brand-darker font-body font-semibold text-xs md:text-sm tracking-wide rounded hover:bg-brand-gold/90 transition-all duration-300 shadow-lg whitespace-nowrap"
                    >
                      <MessageCircle size={14} />
                      Order on WhatsApp
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 md:p-6">
                  <h3 className="font-serif text-sm md:text-lg font-semibold text-brand-dark mb-1 md:mb-2 group-hover:text-brand-gold/90 transition-colors duration-300 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="font-body text-xs md:text-sm text-brand-dark/50 leading-relaxed mb-2 line-clamp-2 hidden sm:block">
                    {product.description}
                  </p>
                  <span className="font-serif text-base md:text-xl font-semibold text-brand-dark">
                    {product.price}
                  </span>
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

import React, { useState } from "react";
import { galleryData } from "../data/mock";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Instagram, X, ChevronLeft, ChevronRight } from "lucide-react";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const GallerySection = () => {
  const [titleRef, titleVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation({ rootMargin: "0px 0px -40px 0px" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index) => {
    setSelectedIndex(index);
    setSelectedImage(galleryData.images[index]);
  };

  const navigateLightbox = (direction) => {
    const newIndex = direction === "next"
      ? (selectedIndex + 1) % galleryData.images.length
      : (selectedIndex - 1 + galleryData.images.length) % galleryData.images.length;
    setSelectedIndex(newIndex);
    setSelectedImage(galleryData.images[newIndex]);
  };

  return (
    <section id="gallery" className="relative py-28 md:py-36 bg-brand-darker overflow-hidden">
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
            <span className="text-brand-gold/80 text-xs tracking-[0.3em] uppercase font-body font-medium">
              Gallery
            </span>
            <div className="w-8 h-[1px] bg-brand-gold/60" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brand-cream leading-tight mb-4">
            {galleryData.title}
          </h2>
          <p className="font-body text-lg text-brand-cream/50 max-w-lg mx-auto">
            {galleryData.subtitle}
          </p>
        </div>

        {/* Masonry Grid */}
        <div
          ref={gridRef}
          className={`columns-2 md:columns-3 gap-4 space-y-4 transition-all duration-700 delay-200 ${
            gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {galleryData.images.map((image, index) => (
            <div
              key={image.id}
              className="group relative break-inside-avoid overflow-hidden rounded-sm cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                  index % 3 === 0 ? "h-[300px]" : index % 3 === 1 ? "h-[220px]" : "h-[260px]"
                }`}
                loading="lazy"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-brand-darker/0 group-hover:bg-brand-darker/40 transition-all duration-500 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border border-brand-gold/50 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-400">
                  <Instagram size={16} className="text-brand-gold" />
                </div>
              </div>
              {/* Gold border on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-gold/20 transition-all duration-500 rounded-sm" />
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="mt-16 text-center">
          <a
            href={`https://instagram.com/${galleryData.instagramHandle.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-brand-gold/20 hover:border-brand-gold/40 rounded-full transition-all duration-300 hover:bg-brand-gold/5"
          >
            <Instagram size={18} className="text-brand-gold/70 group-hover:text-brand-gold transition-colors duration-300" />
           <a
  href={galleryData.instagramUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="font-body text-sm text-brand-cream/70 group-hover:text-brand-cream tracking-wide transition-colors duration-300"
>
  Follow us {galleryData.instagramHandle}
</a>

          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl bg-brand-darker/95 border-brand-gold/10 backdrop-blur-xl p-0 overflow-hidden">
          <VisuallyHidden.Root>
            <DialogTitle>Gallery Image</DialogTitle>
          </VisuallyHidden.Root>
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.src.replace("w=400", "w=1200")}
                alt={selectedImage.alt}
                className="w-full max-h-[80vh] object-contain"
              />
              {/* Navigation */}
              <button
                onClick={() => navigateLightbox("prev")}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-brand-darker/60 border border-brand-gold/20 hover:bg-brand-darker/80 transition-all duration-300"
              >
                <ChevronLeft size={18} className="text-brand-gold" />
              </button>
              <button
                onClick={() => navigateLightbox("next")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-brand-darker/60 border border-brand-gold/20 hover:bg-brand-darker/80 transition-all duration-300"
              >
                <ChevronRight size={18} className="text-brand-gold" />
              </button>
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-darker/80 to-transparent">
                <p className="font-body text-sm text-brand-cream/70">{selectedImage.alt}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

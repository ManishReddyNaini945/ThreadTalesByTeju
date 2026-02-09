import React from "react";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { CollectionSection } from "../components/CollectionSection";
import { BestSellers } from "../components/BestSellers";
import { GallerySection } from "../components/GallerySection";
import { CustomizationSection } from "../components/CustomizationSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-darker">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <CollectionSection />
        <BestSellers />
        <GallerySection />
        <CustomizationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

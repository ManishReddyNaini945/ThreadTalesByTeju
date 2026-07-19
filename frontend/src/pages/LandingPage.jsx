import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CollectionSection from "../components/CollectionSection";
import BestSellers from "../components/BestSellers";
import NewArrivals from "../components/NewArrivals";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />
      <HeroSection />
      <CollectionSection />
      <BestSellers />
      <NewArrivals />
      <AboutSection />
      <ContactSection />
      <Footer />
    </motion.div>
  );
}

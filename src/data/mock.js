import Thread_Bangle from "../assests/images/thread_bangle.jpeg"
import Bridal_Bangle from "../assests/images/bridal_set.jpeg"
import Hair_Accessory from "../assests/images/hair_accessory.png"
import Royal_Pink_Bangle_Set from "../assests/images/pink_royal_thread_bangle_set.jpeg"
import Golden_Bridal_Heritage_Set from "../assests/images/golden_bridal_heritage_set.jpeg"
import Hair_Clips from "../assests/images/hair_clips.jpeg"
import Lotus_Pearl_Neck_Set from "../assests/images/chiain-set.png"
import Chain_Set from "../assests/images/chiain-set.png"
import Invisible_Chain_2 from "../assests/images/invisible chain 2.jpeg"
import Invisible_Chain_12 from "../assests/images/invisible chain 12.jpeg"
import Chain from "../assests/images/chain_2.jpeg"
import Invisible_Chain from "../assests/images/invisible chain 12.jpeg"
import Thread_Bangle_5 from "../assests/images/thread_bangle_5.jpeg"
import Thread_Bangle_10 from "../assests/images/thread_bangle_10.jpeg"
import Thread_Bangle_15 from "../assests/images/thread_bangle_15.jpeg"
import Thread_Bangle_20 from "../assests/images/thread_bangle_20.jpeg"
import Making_Image from "../assests/images/making_image.png"
import Bridal_Set_1 from "../assests/images/bridal_set_1.jpeg"
import Bridal_Set_3 from "../assests/images/bridal_set_3.jpeg"
import Bridal_Set_5 from "../assests/images/bridal_set_5.jpeg"
import Bridal_Set_10 from "../assests/images/bridal_set_10.jpeg"
import Bridal_Set_15 from "../assests/images/bridal_set_15.jpeg"
export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Collection", href: "#collection" },
  { label: "Best Sellers", href: "#bestsellers" },
  { label: "Gallery", href: "#gallery" },
  { label: "Customize", href: "#customize" },
  { label: "Contact", href: "#contact" },
];

export const heroData = {
  headline: "Where Threads Tell Stories",
  subheadline: "Handmade bangles & creative crafts crafted with tradition, love, and detail.",
  ctas: [
    { label: "Explore Collection", href: "#collection", variant: "primary" },
    { label: "Customize Your Order", href: "#customize", variant: "secondary" },
  ],
  trustChips: ["Handmade", "Custom Orders", "Festive & Bridal", "Made in India"],
  backgroundImage: "https://images.unsplash.com/photo-1611598935678-c88dca238fce?w=1920&q=80",
};

export const aboutData = {
  title: "The Art Behind Every Thread",
  description: "Each piece is handwoven with patience, tradition, and modern creativity. Thread Tales By Teju was born from a deep love for Indian craftsmanship — where every bangle carries a story, every thread holds a memory.",
  founderNote: "What started as a personal passion during festive seasons has blossomed into a brand that celebrates the beauty of handmade artistry. Every creation is a labour of love.",
  founder: "Teju",
  image: Making_Image,
  pillars: [
    {
      title: "Craftsmanship",
      description: "Every piece is meticulously handcrafted using premium threads and materials, ensuring unparalleled quality.",
      icon: "Gem",
    },
    {
      title: "Customization",
      description: "Your vision, our creation. We bring your unique ideas to life with personalized designs for every occasion.",
      icon: "Palette",
    },
    {
      title: "Celebration",
      description: "From weddings to festivals, our pieces are designed to make every celebration more beautiful and memorable.",
      icon: "Sparkles",
    },
  ],
};

export const collectionData = {
  title: "Our Collections",
  subtitle: "Explore our curated range of handcrafted treasures",
  categories: [
    {
      id: "thread-bangles",
      name: "Thread Bangles",
      description: "Vibrant handwoven thread bangles in stunning color combinations, perfect for everyday elegance.",
      priceRange: "Starts from ₹79",
      image: Thread_Bangle,
    },
    {
      id: "bridal-bangle-sets",
      name: "Bridal Bangle Sets",
      description: "Exquisite bridal sets crafted for the most special day, blending tradition with contemporary design.",
      priceRange: "Starts from ₹599",
      image: Bridal_Bangle,
    },
    {
      id: "chains",
      name: "Chains",
      description: "Beautiful chain collections with elegant designs for every occasion.",
      priceRange: "Starts from ₹199",
      image: Chain_Set,
    },
    {
      id: "hair-accessories",
      name: "Hair Accessories",
      description: "Elegant handcrafted hair pins, clips, and accessories that add a touch of artistry to your look.",
      priceRange: "Starts from ₹69",
      image: Hair_Accessory,
    },
    {
      id: "invisible-chains",
      name: "Invisible Chains",
      description: "Delicate and elegant invisible chains that add a subtle touch of sophistication to any outfit.",
      priceRange: "Starts from ₹99",
      image: Invisible_Chain,
    },
  ],
};

export const bestSellersData = {
  title: "Signature Pieces",
  subtitle: "Our most loved creations, chosen by you",
  products: [
    {
      id: 1,
      name: "Royal Pink Bangles Set",
      description: "A regal set of handwoven pink thread bangles with gold accent detailing.",
      price: "\u20B9699",
      badge: "Most Loved",
      image: Royal_Pink_Bangle_Set,
    },
    {
      id: 2,
      name: "Golden Bridal Heritage Set",
      description: "An opulent bridal bangle set featuring intricate gold threadwork and pearl embellishments.",
      price: "\u20B9999",
      badge: "Bridal Favourite",
      image: Golden_Bridal_Heritage_Set,
    },
    {
      id: 3,
      name: "Lotus Pearl Neck Set",
      description: "A stunning stack of purple velvet-wrapped bangles, perfect for festive celebrations.",
      price: "\u20B9299",
      badge: "Festive Pick",
      image: Lotus_Pearl_Neck_Set,
    },
    {
      id: 4,
      name: "Designer Invisible Chain",
      description: "Elegant chain set with subtle design elements, perfect for any occasion.",
      price: "₹199",
      badge: "New Arrival",
      image: Invisible_Chain_2,
    },
    {
      id: 5,
      name: "Golden Bridal Heritage Set",
      description: "An opulent bridal bangle set featuring intricate gold threadwork and pearl embellishments.",
      price: "₹799",
      badge: "Bridal Favourite",
      image: Bridal_Set_1,
    },
    {
      id: 6,
      name: "Royal Bridal Collection",
      description: "Luxurious bridal bangles with traditional craftsmanship, perfect for your special day.",
      price: "₹1299",
      badge: "Top Pick",
      image: Bridal_Set_3,
    },
  ],
};

export const galleryData = {
  title: "Our World",
  subtitle: "Designed for weddings, festivals, and everyday elegance.",
  instagramHandle: "@thread_tales_by_teju",
  instagramUrl: "https://instagram.com/thread_tales_by_teju",
  images: [
    { id: 1, src: Thread_Bangle_5, alt: "Vibrant thread bangles collection" },
    { id: 2, src: Bridal_Set_5, alt: "Elegant bridal bangle set" },
    { id: 3, src: Invisible_Chain_2, alt: "Designer invisible chain" },
    { id: 4, src: Thread_Bangle_10, alt: "Contemporary thread bangles" },
    { id: 5, src: Bridal_Set_1, alt: "Majestic bridal bangles" },
    { id: 6, src: Chain, alt: "Elegant invisible chain" },
    { id: 7, src: Thread_Bangle_15, alt: "Vibrant thread bangles" },
    { id: 8, src: Bridal_Set_15, alt: "Magnificent bridal set" },
    { id: 9, src: Royal_Pink_Bangle_Set, alt: "Royal pink bangles set" },
  ],
};

export const customizationSteps = [
  {
    step: 1,
    title: "Share Your Idea",
    description: "Tell us about your dream design — colors, patterns, occasion, and any special details you envision.",
    icon: "MessageCircle",
  },
  {
    step: 2,
    title: "Choose Colors & Design",
    description: "We'll share design options and color palettes for you to pick the perfect combination.",
    icon: "Palette",
  },
  {
    step: 3,
    title: "Handcrafted by Teju",
    description: "Your piece is lovingly handcrafted with premium materials, attention to detail, and artisan care.",
    icon: "Hand",
  },
  {
    step: 4,
    title: "Delivered with Love",
    description: "Beautifully packaged and delivered to your doorstep, ready to make your occasion unforgettable.",
    icon: "Gift",
  },
];


export const whatsappNumber = "919866052260";
export const whatsappURL = `https://wa.me/${whatsappNumber}`;


export const contactData = {
  instagram: "@thread_tales_by_teju",
 
  instagramUrl: "https://www.instagram.com/thread_tales_by_teju/",

  tagline: "DM us for customization & orders",
  whatsapp: "+91 9866052260",
};

export const footerData = {
  brand: "Thread Tales By Teju",
  tagline: "Handcrafted stories, one thread at a time.",
  links: [
    { label: "About", href: "#about" },
    { label: "Collection", href: "#collection" },
    { label: "Customization", href: "#customize" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ],
  copyright: `\u00A9 ${new Date().getFullYear()} Thread Tales By Teju. All rights reserved.`,
};

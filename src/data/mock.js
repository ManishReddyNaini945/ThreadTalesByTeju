import Thread_Bangle from "../assests/images/thread_bangle.jpeg"
import Bridal_Bangle from "../assests/images/bridal_set.jpeg"
import Hair_Accessory from "../assests/images/hair_accessory.png"
import Royal_Pink_Bangle_Set from "../assests/images/pink_royal_thread_bangle_set.jpeg"
import Golden_Bridal_Heritage_Set from "../assests/images/golden_bridal_heritage_set.jpeg"
import Hair_Clips from "../assests/images/hair_clips.jpeg"
import Lotus_Hair_Accessory from "../assests/images/lotus_hair_accessory.jpeg"
import Lotus_Pearl_Neck_Set from "../assests/images/chiain-set.png"
import Ear_Rings from "../assests/images/ear_rings.jpeg" 
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
  image: "https://images.unsplash.com/photo-1609619742069-f5e18afeef17?w=800&q=80",
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
      id: 1,
      name: "Thread Bangles",
      description: "Vibrant handwoven thread bangles in stunning color combinations, perfect for everyday elegance.",
      priceRange: "Starts from \u20B979",
      image: Thread_Bangle,
    },
    {
      id: 2,
      name: "Bridal Bangle Sets",
      description: "Exquisite bridal sets crafted for the most special day, blending tradition with contemporary design.",
      priceRange: "Starts from \u20B9799",
      image: Bridal_Bangle,
    },
    {
      id: 3,
      name: "Festive Collections",
      description: "Celebrate Navratri, Diwali, and every festival with our specially designed festive bangles.",
      priceRange: "Starts from \u20B9499",
      image: "https://images.unsplash.com/photo-1670820285472-15a9b2c79d00?w=600&q=80",
    },
    {
      id: 4,
      name: "Hair Accessories",
      description: "Elegant handcrafted hair pins, clips, and accessories that add a touch of artistry to your look.",
      priceRange: "Starts from \u20B999",
      image: Hair_Accessory,
    },
    {
      id: 5,
      name: "Custom Craft Orders",
      description: "Dream it, and we'll create it. Fully customized pieces tailored to your style and occasion.",
      priceRange: "Starts from \u20B9599",
      image: "https://images.unsplash.com/photo-1760786933663-327c858d5434?w=600&q=80",
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
      price: "\u20B9799",
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
      name: "Lotus Hair Accessory",
      description: "A delicate lotus-inspired hair accessory handcrafted with silk threads and stones.",
      price: "\u20B999",
      badge: "New Arrival",
      image: Lotus_Hair_Accessory,
    },
    {
      id: 5,
      name: "Customized Name Bangles",
      description: "Personalized bangles with your name or initials, a perfect gift for loved ones.",
      price: "\u20B9399",
      badge: "Personalizable",
      image: "https://images.unsplash.com/photo-1766560363512-00704a8fb5a2?w=500&q=80",
    },
  ],
};

export const galleryData = {
  title: "Our World",
  subtitle: "Designed for weddings, festivals, and everyday elegance.",
  instagramHandle: "@thread_tales_by_teju",
  instagramUrl: "https://instagram.com/thread_tales_by_teju",
  images: [
    { id: 1, src: "https://images.unsplash.com/photo-1611598935678-c88dca238fce?w=400&q=80", alt: "Bridal bangles collection" },
    { id: 2, src: "https://images.unsplash.com/photo-1766560362718-7f13c602e153?w=400&q=80", alt: "Teal thread bangles" },
    { id: 3, src: "https://images.unsplash.com/photo-1670820285472-15a9b2c79d00?w=400&q=80", alt: "Colorful bangles display" },
    { id: 4, src: "https://images.unsplash.com/photo-1609619742069-f5e18afeef17?w=400&q=80", alt: "Artisan crafting" },
    { id: 5, src: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=400&q=80", alt: "Wedding jewelry" },
    { id: 6, src: "https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=400&q=80", alt: "Festive bangles" },
    { id: 7, src: "https://images.unsplash.com/photo-1769500805415-0f9485e70e5b?w=400&q=80", alt: "Gold bridal set" },
    { id: 8, src: "https://images.unsplash.com/photo-1607007790046-4a558c42850a?w=400&q=80", alt: "Wedding jewelry presentation" },
    { id: 9, src: "https://images.unsplash.com/photo-1639268230526-6ac0a81d232e?w=400&q=80", alt: "Elegant jewelry display" },
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


export const instaDmURL =
  "https://www.instagram.com/direct/new/?username=thread_tales_by_teju";


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

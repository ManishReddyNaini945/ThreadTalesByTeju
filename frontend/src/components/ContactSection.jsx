import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Instagram, MessageCircle } from "lucide-react";

const CONTACTS = [
  { icon: MessageCircle, label: "WhatsApp", value: "+91 98660 52260", href: "https://wa.me/919866052260", color: "#25D366" },
  { icon: Instagram, label: "Instagram", value: "@thread_tales_by_teju", href: "https://instagram.com/thread_tales_by_teju", color: "#E1306C" },
  { icon: Mail, label: "Email", value: "tejureddy6060@gmail.com", href: "mailto:tejureddy6060@gmail.com", color: "var(--gold)" },
  { icon: Phone, label: "Phone", value: "+91 98660 52260", href: "tel:+919866052260", color: "var(--gold)" },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = [
      `Hi! I'm contacting from Thread Tales by Teju.`,
      form.name    ? `*Name:* ${form.name}`       : "",
      form.email   ? `*Email:* ${form.email}`     : "",
      form.phone   ? `*Phone:* ${form.phone}`     : "",
      form.message ? `*Message:* ${form.message}` : "",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/919866052260?text=${encodeURIComponent(text)}`, "_blank");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const inputStyle = {
    border: "1px solid var(--border)",
    color: "var(--cream)",
    caretColor: "var(--gold)",
  };

  return (
    <section id="contact" className="py-16 lg:py-32" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-tag mb-6">Get in Touch</p>
            <h2 className="section-title mb-8">
              We'd Love to<br />
              Hear from You
            </h2>
            <p className="text-base leading-relaxed mb-12" style={{ color: "var(--cream-dim)" }}>
              Have a question about a product, want to place a custom order, or just want to say hello?
              Reach out — we're always happy to help.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONTACTS.map(({ icon: Icon, label, value, href, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3 }}
                  className="flex items-start gap-4 p-5 transition-colors duration-200"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                    style={{ border: "1px solid var(--border)" }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--cream-dim)" }}>
                      {label}
                    </p>
                    <p className="text-sm" style={{ color: "var(--cream)" }}>{value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="p-5 sm:p-8 lg:p-10"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p className="text-xl font-normal mb-8" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              Send a Message
            </p>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

              {/* Name */}
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Teju Sharma"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                  className="w-full bg-transparent py-3 px-4 text-sm outline-none transition-colors duration-200"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="teju@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full bg-transparent py-3 px-4 text-sm outline-none transition-colors duration-200"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="w-full bg-transparent py-3 px-4 text-sm outline-none transition-colors duration-200"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="I'd like to know more about..."
                  value={form.message}
                  onChange={handleChange("message")}
                  required
                  className="w-full bg-transparent py-3 px-4 text-sm outline-none resize-none transition-colors duration-200"
                  style={{ ...inputStyle }}
                  onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>

              <button type="submit" className="btn-gold w-full justify-center mt-2">
                Send via WhatsApp
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

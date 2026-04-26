import { motion } from "framer-motion";
import { Mail, Phone, Instagram, MessageCircle } from "lucide-react";

const CONTACTS = [
  { icon: MessageCircle, label: "WhatsApp", value: "+91 98660 52260", href: "https://wa.me/919866052260", color: "#25D366" },
  { icon: Instagram, label: "Instagram", value: "@thread_tales_by_teju", href: "https://instagram.com/thread_tales_by_teju", color: "#E1306C" },
  { icon: Mail, label: "Email", value: "tejureddy6060@gmail.com", href: "mailto:tejureddy6060@gmail.com", color: "var(--gold)" },
  { icon: Phone, label: "Phone", value: "+91 98660 52260", href: "tel:+919866052260", color: "var(--gold)" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 lg:py-32" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

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
            className="p-8 lg:p-10"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p className="text-xl font-normal mb-8" style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}>
              Send a Message
            </p>
            <form className="flex flex-col gap-5"
              onSubmit={(e) => { e.preventDefault(); window.open(`https://wa.me/919866052260?text=Hello! I have a query.`, "_blank"); }}>

              {[
                { label: "Your Name", type: "text", placeholder: "Priya Sharma" },
                { label: "Email Address", type: "email", placeholder: "priya@example.com" },
                { label: "Phone Number", type: "tel", placeholder: "+91 98660 52260" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full bg-transparent py-3 px-4 text-sm outline-none transition-colors duration-200"
                    style={{
                      border: "1px solid var(--border)",
                      color: "var(--cream)",
                      caretColor: "var(--gold)",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--cream-dim)" }}>
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="I'd like to know more about..."
                  className="w-full bg-transparent py-3 px-4 text-sm outline-none resize-none transition-colors duration-200"
                  style={{ border: "1px solid var(--border)", color: "var(--cream)", caretColor: "var(--gold)" }}
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

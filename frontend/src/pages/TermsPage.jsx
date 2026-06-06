import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2
      className="text-xl mb-4"
      style={{ fontFamily: "Playfair Display, serif", color: "var(--gold)" }}
    >
      {title}
    </h2>
    <div className="text-sm leading-relaxed space-y-3" style={{ color: "var(--cream-dim)" }}>
      {children}
    </div>
  </div>
);

export default function TermsPage() {
  return (
    <div>
      <Navbar />
      {/* Spacer to push content below the fixed navbar */}
      <div className="h-14 sm:h-20 lg:h-24" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >

      {/* Hero */}
      <div
        className="py-16 text-center"
        style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border)" }}
      >
        <p
          className="text-xs tracking-[0.35em] uppercase mb-3"
          style={{ color: "var(--cream-dim)" }}
        >
          Legal
        </p>
        <h1
          className="text-4xl md:text-5xl font-normal"
          style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}
        >
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm" style={{ color: "var(--cream-dim)" }}>
          Last updated: June 2025
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using the Thread Tales by Teju website ("Site") or placing an order, you
            agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use
            our Site or services.
          </p>
        </Section>

        <Section title="2. About Us">
          <p>
            Thread Tales by Teju is a handcrafted jewellery brand based in Hyderabad, Telangana,
            India, specialising in thread bangles, bridal sets, invisible chains, hair accessories,
            and saree pins.
          </p>
          <ul className="list-none space-y-1">
            <li>Email: tejureddy6060@gmail.com</li>
            <li>Phone: +91 98660 52260</li>
            <li>Address: Hyderabad, Telangana, India</li>
          </ul>
        </Section>

        <Section title="3. Products">
          <p>
            All products listed on our Site are handcrafted and subject to availability. We reserve
            the right to discontinue any product at any time. Product images are for illustrative
            purposes; slight colour variations may occur due to screen settings and the handcrafted
            nature of our items.
          </p>
          <p>
            Customisation requests are accepted at our discretion. Custom orders are non-refundable
            once production has begun.
          </p>
        </Section>

        <Section title="4. Pricing">
          <p>
            All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless
            stated otherwise. We reserve the right to change prices at any time without prior notice.
            The price at the time of order placement will apply to your purchase.
          </p>
        </Section>

        <Section title="5. Orders & Payment">
          <p>
            Placing an order constitutes an offer to purchase. We reserve the right to accept or
            decline any order. Once payment is confirmed, you will receive an order confirmation
            email.
          </p>
          <p>
            Payments are processed securely via Cashfree Payments. We accept UPI, debit/credit cards,
            net banking, and other methods available through our payment gateway. All transactions are
            encrypted and secure.
          </p>
        </Section>

        <Section title="6. Shipping & Delivery">
          <p>
            We ship across India. Estimated delivery times are 5–10 business days from order
            confirmation, subject to courier availability and location. We are not responsible for
            delays caused by courier partners or circumstances beyond our control.
          </p>
          <p>
            Shipping charges, if applicable, will be displayed at checkout before payment.
          </p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            All content on this Site, including product photos, descriptions, logo, and design, is
            the intellectual property of Thread Tales by Teju. You may not reproduce, distribute, or
            use any content without our express written permission.
          </p>
        </Section>

        <Section title="8. User Accounts">
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. Any
            activity under your account is your responsibility. Notify us immediately if you suspect
            unauthorised access at{" "}
            <a href="mailto:tejureddy6060@gmail.com" style={{ color: "var(--gold)" }}>
              tejureddy6060@gmail.com
            </a>
            .
          </p>
          <p>
            We reserve the right to terminate accounts that violate these terms or engage in
            fraudulent activity.
          </p>
        </Section>

        <Section title="9. Prohibited Conduct">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the Site for any unlawful purpose.</li>
            <li>Attempt to gain unauthorised access to our systems.</li>
            <li>Submit false or fraudulent orders or payment information.</li>
            <li>Post harmful, offensive, or misleading reviews or content.</li>
          </ul>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, Thread Tales by Teju shall not be liable for any
            indirect, incidental, or consequential damages arising from your use of the Site or
            purchase of products. Our total liability shall not exceed the amount paid for the
            specific order in question.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms &amp; Conditions are governed by the laws of India. Any disputes shall be
            subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
          </p>
        </Section>

        <Section title="12. Changes to Terms">
          <p>
            We reserve the right to modify these Terms &amp; Conditions at any time. Updated terms
            will be posted on this page with a revised date. Continued use of the Site after changes
            constitutes acceptance of the new terms.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>For any questions regarding these Terms, please contact us:</p>
          <ul className="list-none space-y-1">
            <li>
              Email:{" "}
              <a href="mailto:tejureddy6060@gmail.com" style={{ color: "var(--gold)" }}>
                tejureddy6060@gmail.com
              </a>
            </li>
            <li>Phone: +91 98660 52260</li>
          </ul>
        </Section>

        {/* Navigation links */}
        <div
          className="flex flex-wrap gap-4 mt-12 pt-8 text-sm"
          style={{ borderTop: "1px solid var(--border)", color: "var(--cream-dim)" }}
        >
          <Link to="/privacy-policy" style={{ color: "var(--gold)" }}>
            Privacy Policy →
          </Link>
          <Link to="/refund-policy" style={{ color: "var(--gold)" }}>
            Refund &amp; Cancellation Policy →
          </Link>
        </div>
      </div>

      <Footer />
    </motion.div>
    </div>
  );
}

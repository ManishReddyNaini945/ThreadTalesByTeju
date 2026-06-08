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

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm" style={{ color: "var(--cream-dim)" }}>
          Last updated: June 2025
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Section title="1. Introduction">
          <p>
            Thread Tales by Teju ("we", "our", or "us") is committed to protecting your personal
            information. This Privacy Policy explains how we collect, use, disclose, and safeguard
            your data when you visit our website or place an order with us.
          </p>
          <p>
            By using our website, you consent to the practices described in this policy. If you
            disagree with any part, please discontinue use of our services.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We may collect the following types of personal information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong style={{ color: "var(--cream)" }}>Account Information:</strong> Name, email
              address, and password when you create an account.
            </li>
            <li>
              <strong style={{ color: "var(--cream)" }}>Order Information:</strong> Billing address,
              shipping address, phone number, and payment details required to fulfil your orders.
            </li>
            <li>
              <strong style={{ color: "var(--cream)" }}>Usage Data:</strong> Pages visited, browser
              type, device information, and IP address collected automatically via cookies.
            </li>
            <li>
              <strong style={{ color: "var(--cream)" }}>Communications:</strong> Messages you send us
              via email or contact forms.
            </li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Process and fulfil your orders, and send order confirmations and updates.</li>
            <li>Manage your account and provide customer support.</li>
            <li>Send promotional emails and newsletters (only with your consent).</li>
            <li>Improve our website, products, and services.</li>
            <li>Comply with legal obligations and prevent fraudulent transactions.</li>
          </ul>
        </Section>

        <Section title="4. Payment Processing">
          <p>
            Payments are processed securely through Cashfree Payments, a PCI-DSS compliant payment
            gateway. We do not store your full card details on our servers. Your payment data is
            handled directly by Cashfree in accordance with their security standards.
          </p>
        </Section>

        <Section title="5. Sharing Your Information">
          <p>We do not sell, trade, or rent your personal information to third parties. We may share data with:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong style={{ color: "var(--cream)" }}>Service Providers:</strong> Payment gateways,
              shipping partners, and email service providers who assist in operating our website.
            </li>
            <li>
              <strong style={{ color: "var(--cream)" }}>Legal Compliance:</strong> Authorities when
              required by law or to protect our rights.
            </li>
          </ul>
        </Section>

        <Section title="6. Cookies">
          <p>
            Our website uses cookies to enhance your browsing experience. Cookies help us remember
            your preferences, keep you logged in, and understand how you use our site. You can
            disable cookies in your browser settings, though some features may not function correctly.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            We retain your personal data for as long as your account is active or as needed to
            provide services. Order records may be retained for up to 5 years for accounting and
            legal purposes. You may request deletion of your account and associated data at any time.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data (subject to legal obligations).</li>
            <li>Opt out of marketing communications at any time.</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a
              href="mailto:threadtalesbyteju946@gmail.com"
              style={{ color: "var(--gold)" }}
            >
              threadtalesbyteju946@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="9. Security">
          <p>
            We implement industry-standard security measures including SSL encryption and secure
            servers to protect your data. However, no method of transmission over the internet is
            100% secure, and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy periodically. Changes will be posted on this page with
            a revised "Last updated" date. We encourage you to review this policy regularly.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>If you have any questions about this Privacy Policy, please reach out:</p>
          <ul className="list-none space-y-1">
            <li>
              Email:{" "}
              <a href="mailto:threadtalesbyteju946@gmail.com" style={{ color: "var(--gold)" }}>
                threadtalesbyteju946@gmail.com
              </a>
            </li>
            <li>Phone: +91 98660 52260</li>
            <li>Address: Hyderabad, Telangana, India</li>
          </ul>
        </Section>

        {/* Navigation links */}
        <div
          className="flex flex-wrap gap-4 mt-12 pt-8 text-sm"
          style={{ borderTop: "1px solid var(--border)", color: "var(--cream-dim)" }}
        >
          <Link to="/terms-and-conditions" style={{ color: "var(--gold)" }}>
            Terms &amp; Conditions →
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

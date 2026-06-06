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

export default function RefundPolicyPage() {
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
          Refund &amp; Cancellation Policy
        </h1>
        <p className="mt-3 text-sm" style={{ color: "var(--cream-dim)" }}>
          Last updated: June 2025
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Section title="1. Overview">
          <p>
            At Thread Tales by Teju, every piece is handcrafted with care. We want you to be
            completely satisfied with your purchase. Please read our Refund &amp; Cancellation Policy
            carefully before placing an order.
          </p>
        </Section>

        <Section title="2. Cancellations">
          <p>
            <strong style={{ color: "var(--cream)" }}>Before Dispatch:</strong> You may cancel your
            order within 24 hours of placing it by contacting us at{" "}
            <a href="mailto:tejureddy6060@gmail.com" style={{ color: "var(--gold)" }}>
              tejureddy6060@gmail.com
            </a>{" "}
            or calling +91 98660 52260. A full refund will be initiated once the cancellation is
            confirmed.
          </p>
          <p>
            <strong style={{ color: "var(--cream)" }}>After Dispatch:</strong> Orders cannot be
            cancelled once they have been dispatched. In such cases, you may initiate a return after
            receiving the product, subject to our return conditions below.
          </p>
          <p>
            <strong style={{ color: "var(--cream)" }}>Custom / Personalised Orders:</strong> Custom
            orders cannot be cancelled once production has commenced, as they are made specifically
            for you.
          </p>
        </Section>

        <Section title="3. Returns">
          <p>We accept returns under the following conditions:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The return request is raised within <strong style={{ color: "var(--cream)" }}>7 days</strong> of delivery.</li>
            <li>The product is unused, unworn, and in its original packaging.</li>
            <li>The product is not a custom or personalised order.</li>
            <li>The product is not damaged due to misuse or mishandling.</li>
          </ul>
          <p>
            To initiate a return, contact us with your order number and photos of the product at{" "}
            <a href="mailto:tejureddy6060@gmail.com" style={{ color: "var(--gold)" }}>
              tejureddy6060@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="4. Damaged or Defective Products">
          <p>
            If you receive a damaged or defective item, please contact us within{" "}
            <strong style={{ color: "var(--cream)" }}>48 hours</strong> of delivery with clear
            photographs of the product and packaging. We will arrange a replacement or full refund at
            no additional cost to you.
          </p>
        </Section>

        <Section title="5. Non-Returnable Items">
          <p>The following items are not eligible for return or refund:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Custom / personalised jewellery.</li>
            <li>Items showing signs of use, wear, or damage caused by the customer.</li>
            <li>Items returned without original packaging or tags.</li>
            <li>Items where the return request is raised after 7 days of delivery.</li>
          </ul>
        </Section>

        <Section title="6. Refund Process">
          <p>
            Once we receive and inspect your return, we will notify you of the refund decision within
            2 business days.
          </p>
          <p>
            Approved refunds are processed to your original payment method within{" "}
            <strong style={{ color: "var(--cream)" }}>5–7 business days</strong>. Depending on your
            bank or payment provider, it may take additional time to reflect in your account.
          </p>
          <p>
            Shipping charges are non-refundable unless the return is due to our error or a defective
            product.
          </p>
        </Section>

        <Section title="7. Exchange Policy">
          <p>
            We currently do not offer direct exchanges. If you would like a different product, please
            return the original item (subject to return conditions) and place a new order.
          </p>
        </Section>

        <Section title="8. Return Shipping">
          <p>
            Customers are responsible for return shipping costs, except in cases of damaged or
            defective items. We recommend using a trackable shipping method, as we are not
            responsible for items lost in transit.
          </p>
        </Section>

        <Section title="9. Contact Us">
          <p>
            For any questions or to initiate a cancellation, return, or refund, please reach out to
            us:
          </p>
          <ul className="list-none space-y-1">
            <li>
              Email:{" "}
              <a href="mailto:tejureddy6060@gmail.com" style={{ color: "var(--gold)" }}>
                tejureddy6060@gmail.com
              </a>
            </li>
            <li>Phone: +91 98660 52260</li>
            <li>WhatsApp: +91 98660 52260</li>
            <li>Address: Hyderabad, Telangana, India</li>
          </ul>
          <p>We aim to respond to all queries within 1–2 business days.</p>
        </Section>

        {/* Navigation links */}
        <div
          className="flex flex-wrap gap-4 mt-12 pt-8 text-sm"
          style={{ borderTop: "1px solid var(--border)", color: "var(--cream-dim)" }}
        >
          <Link to="/privacy-policy" style={{ color: "var(--gold)" }}>
            Privacy Policy →
          </Link>
          <Link to="/terms-and-conditions" style={{ color: "var(--gold)" }}>
            Terms &amp; Conditions →
          </Link>
        </div>
      </div>

      <Footer />
    </motion.div>
    </div>
  );
}

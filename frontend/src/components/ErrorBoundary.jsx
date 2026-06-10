import { Component } from "react";
import * as Sentry from "@sentry/react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info);
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.captureException(error, { extra: info });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center px-4 text-center"
          style={{ background: "var(--bg)" }}
        >
          <div>
            <h1
              className="text-2xl sm:text-3xl font-normal mb-3"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}
            >
              Something went wrong
            </h1>
            <p className="text-sm mb-8" style={{ color: "var(--cream-dim)" }}>
              We're sorry for the inconvenience. Please reload the page and try again.
            </p>
            <button onClick={() => window.location.reload()} className="btn-gold">
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { useState, useEffect } from "react";
import api from "../services/api";

const DEFAULT = {
  enabled: true,
  threshold: 999,
  discount_pct: 15,
  label: "15% OFF + FREE SHIPPING",
};

export function usePromoSettings() {
  const [promo, setPromo] = useState(DEFAULT);

  useEffect(() => {
    api.get("/settings/promo")
      .then(({ data }) => setPromo(data))
      .catch(() => {}); // silently fall back to defaults
  }, []);

  return promo;
}

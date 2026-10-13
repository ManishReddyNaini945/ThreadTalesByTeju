import { useState, useEffect } from "react";
import api from "../services/api";

// Slugs of categories the admin has hidden (Admin -> Categories -> Visible toggle).
export function useHiddenCategories() {
  const [hidden, setHidden] = useState(() => new Set());

  useEffect(() => {
    api.get("/products/categories/hidden")
      .then(({ data }) => setHidden(new Set(Array.isArray(data) ? data : [])))
      .catch(() => {}); // fall back to showing everything
  }, []);

  return hidden;
}

// Pulls the category slug out of a "/shop?category=x" or "/category/x" link.
export function categorySlugFromPath(path = "") {
  const query = path.match(/[?&]category=([^&#]+)/);
  if (query) return query[1];
  const page = path.match(/^\/category\/([^/?#]+)/);
  return page ? page[1] : null;
}

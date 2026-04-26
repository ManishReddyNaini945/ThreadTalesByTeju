import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { wishlistService } from "../services/wishlistService";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlistIds(new Set()); setWishlistItems([]); return; }
    try {
      const [idsRes, itemsRes] = await Promise.all([
        wishlistService.getWishlistIds(),
        wishlistService.getWishlist(),
      ]);
      setWishlistIds(new Set(idsRes.data));
      setWishlistItems(itemsRes.data);
    } catch { /* silently fail */ }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!user) { toast.error("Please login to use wishlist"); return; }
    const isWishlisted = wishlistIds.has(productId);
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(productId);
        setWishlistIds((prev) => { const s = new Set(prev); s.delete(productId); return s; });
        setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Removed from wishlist");
      } else {
        await wishlistService.addToWishlist(productId);
        setWishlistIds((prev) => new Set([...prev, productId]));
        toast.success("Added to wishlist!");
        fetchWishlist();
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const isWishlisted = (productId) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistIds, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

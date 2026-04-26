import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, item_count: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], subtotal: 0, item_count: 0 }); return; }
    try {
      const { data } = await cartService.getCart();
      setCart(data);
    } catch { /* silently fail */ }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, color = null, size = null) => {
    if (!user) { toast.error("Please login to add items to cart"); return false; }
    setLoading(true);
    try {
      const { data } = await cartService.addItem({
        product_id: productId,
        quantity,
        selected_color: color,
        selected_size: size,
      });
      setCart(data);
      toast.success("Added to cart!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add to cart");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    try {
      const { data } = await cartService.updateItem(itemId, quantity);
      setCart(data);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      const { data } = await cartService.removeItem(itemId);
      setCart(data);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], subtotal: 0, item_count: 0 });
    } catch { /* silently fail */ }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

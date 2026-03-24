"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  slug: string;
  qty: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: { id: string; name: string; price: number; slug: string; images?: string[] }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  loaded: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const storageKey = "cart_inegol-mobilya";
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, loaded]);

  const addItem = (product: { id: string; name: string; price: number; slug: string; images?: string[] }) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, slug: product.slug, qty: 1, image: product.images?.[0] }];
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeItem(id);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };
  const clearCart = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count, loaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

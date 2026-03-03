import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { cartApi, type CartItem } from '../lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext<{
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, qty?: number) => Promise<void>;
  updateQty: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data } = await cartApi.get();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = useCallback(
    async (productId: string, qty = 1) => {
      if (!token) return;
      setLoading(true);
      const { data } = await cartApi.add(productId, qty);
      if (Array.isArray(data)) setItems(data);
      setLoading(false);
    },
    [token]
  );

  const updateQty = useCallback(
    async (productId: string, quantity: number) => {
      if (!token) return;
      setLoading(true);
      const { data } = await cartApi.update(productId, quantity);
      if (Array.isArray(data)) setItems(data);
      setLoading(false);
    },
    [token]
  );

  const remove = useCallback(
    async (productId: string) => {
      if (!token) return;
      setLoading(true);
      const { data } = await cartApi.remove(productId);
      if (Array.isArray(data)) setItems(data);
      setLoading(false);
    },
    [token]
  );

  return (
    <CartContext.Provider value={{ items, loading, addToCart, updateQty, remove, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { wishlistApi } from '../lib/api';

type WishlistContextType = {
  ids: Set<string>;
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<{ error?: string; inWishlist?: boolean }>;
  refreshWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refreshWishlist = async () => {
    if (!token) {
      setIds(new Set());
      return;
    }
    setLoading(true);
    const { data } = await wishlistApi.list();
    setLoading(false);
    setIds(new Set(data?.productIds || []));
  };

  useEffect(() => {
    refreshWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const toggleWishlist = async (productId: string) => {
    const { data, error } = await wishlistApi.toggle(productId);
    if (error) return { error };
    if (data?.productIds) setIds(new Set(data.productIds));
    return { inWishlist: data?.inWishlist };
  };

  const value = useMemo(
    () => ({
      ids,
      loading,
      isWishlisted: (productId: string) => ids.has(productId),
      toggleWishlist,
      refreshWishlist,
    }),
    [ids, loading]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

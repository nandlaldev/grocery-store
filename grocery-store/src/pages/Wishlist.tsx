import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { wishlistApi, type WishlistProduct } from '../lib/api';

export default function Wishlist() {
  const { token } = useAuth();
  const { toggleWishlist } = useWishlist();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data } = await wishlistApi.list();
      setItems(Array.isArray(data?.products) ? data.products : []);
      setLoading(false);
    })();
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;

  const onToggle = async (productId: string) => {
    const result = await toggleWishlist(productId);
    if (result.error) {
      setToast(result.error);
      return;
    }
    setItems((prev) => prev.filter((p) => p._id !== productId));
    setToast('Removed from wishlist');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-sm text-gray-600 mt-1">Products you saved for later.</p>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Your wishlist is empty.</p>
              <Link to="/products" className="inline-block mt-3 text-primary font-medium hover:underline">
                Browse products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((p) => (
                <div key={p._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <Link to={`/product/${p._id}`} className="block aspect-square bg-gray-100">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl.startsWith('http') ? p.imageUrl : `${import.meta.env.VITE_API_URL || ''}${p.imageUrl}`}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                    )}
                  </Link>
                  <div className="p-3">
                    <Link to={`/product/${p._id}`}>
                      <h3 className="font-medium text-gray-900 truncate">{p.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{p.description || '—'}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold text-primary">₹{p.price}</span>
                      <button
                        type="button"
                        onClick={() => onToggle(p._id)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
      <Footer />
    </div>
  );
}

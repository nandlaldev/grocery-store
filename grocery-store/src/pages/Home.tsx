import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi, configApi } from '../lib/api';
import BannerSlider from '../components/BannerSlider';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [products, setProducts] = useState<
    Array<{ _id: string; name: string; price: number; description: string; category: string; imageUrl: string }>
  >([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [banners, setBanners] = useState<Array<{ id: string; imageUrl: string; title: string; subtitle: string; order: number }>>([]);
  const { items, addToCart, updateQty, loading: cartLoading } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    configApi.get().then(({ data }) => {
      if (data?.banners?.length) setBanners(data.banners);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const [pRes, cRes] = await Promise.all([
        productsApi.list({ category: category || undefined, search: search || undefined }),
        productsApi.categories(),
      ]);
      if (pRes.data) setProducts(pRes.data);
      if (cRes.data) setCategories(cRes.data);
      setLoading(false);
    })();
  }, [category, search]);

  const handleAddToCart = async (productId: string) => {
    if (!token) {
      setToast('Please login to add to cart');
      return;
    }
    await addToCart(productId);
    setToast('Added to cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        {banners.length > 0 && <BannerSlider banners={banners} />}
        <section className="mb-5 bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {categories.length > 0 && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </section>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <Link to={`/product/${p._id}`} className="block aspect-square bg-gray-100">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl.startsWith('http') ? p.imageUrl : `${import.meta.env.VITE_API_URL || ''}${p.imageUrl}`}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </Link>
                <div className="p-3">
                  <Link to={`/product/${p._id}`}>
                    <h3 className="font-medium text-gray-900 truncate">{p.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{p.description || '—'}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold text-primary">₹{p.price}</span>
                    {(() => {
                      const qty = items.find((i) => i.productId === p._id)?.quantity ?? 0;
                      if (qty === 0) {
                        return (
                          <button
                            onClick={() => handleAddToCart(p._id)}
                            disabled={cartLoading}
                            className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
                          >
                            Add
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQty(p._id, qty - 1)}
                            disabled={cartLoading}
                            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-semibold text-gray-900">{qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(p._id, qty + 1)}
                            disabled={cartLoading}
                            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Why Shop With Us</h2>
              <p className="mt-2 text-gray-600">
                Fresh products, fast delivery, and hassle-free experience.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex gap-3 items-start rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12" />
                  <path d="M22 16H2" />
                  <path d="M18 20H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                <p className="text-sm text-gray-600 mt-1">Quick processing and on-time delivery updates.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fresh Quality</h3>
                <p className="text-sm text-gray-600 mt-1">Carefully selected groceries you can trust.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15V7a2 2 0 0 0-2-2H7l-4 4v8a2 2 0 0 0 2 2h8" />
                  <path d="M8 13h8" />
                  <path d="M8 10h6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                <p className="text-sm text-gray-600 mt-1">Simple support for order-related issues.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M12 11v6" />
                  <path d="M12 7h.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Checkout</h3>
                <p className="text-sm text-gray-600 mt-1">Your information stays protected.</p>
              </div>
            </div>
          </div>
        </section>
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

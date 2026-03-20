import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
};

type SortBy = 'relevance' | 'newest' | 'price_asc' | 'price_desc';

function clampPage(p: number, totalPages: number) {
  if (totalPages <= 1) return 1;
  return Math.min(Math.max(1, p), totalPages);
}

export default function Products() {
  const { items, addToCart, updateQty, loading: cartLoading } = useCart();
  const { token } = useAuth();

  const params = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [sortBy, setSortBy] = useState<SortBy>((params.get('sort') as SortBy) || 'newest');
  const [page, setPage] = useState(() => clampPage(parseInt(params.get('page') || '1', 10), 1));

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const PAGE_SIZE = 8;

  const fetchData = async () => {
    setLoading(true);
    const [pRes, cRes] = await Promise.all([
      productsApi.list({ category: category || undefined, search: search || undefined }),
      productsApi.categories(),
    ]);
    setProducts(Array.isArray(pRes.data) ? pRes.data : []);
    setCategories(Array.isArray(cRes.data) ? cRes.data : []);
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sortBy]);

  const sortedProducts = useMemo(() => {
    if (sortBy === 'price_asc') return [...products].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') return [...products].sort((a, b) => b.price - a.price);
    // relevance/newest: keep API order (newest first)
    return products;
  }, [products, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => clampPage(p, totalPages));
  }, [totalPages]);

  const currentProducts = sortedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        <section className="mb-5 bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              aria-label="Sort products"
            >
              <option value="newest">Newest</option>
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : currentProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentProducts.map((p) => (
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

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">{page}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
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


import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productsApi } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<{
    _id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const { addToCart, loading: cartLoading } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await productsApi.get(id);
      setProduct(data || null);
      setLoading(false);
    })();
  }, [id]);

  const handleAdd = async () => {
    if (!product) return;
    if (!token) {
      setToast('Please login to add to cart');
      return;
    }
    await addToCart(product._id);
    setToast('Added to cart');
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {loading ? <p className="text-gray-500">Loading...</p> : <p className="text-gray-500">Product not found.</p>}
      </div>
    );
  }

  const imgSrc = product.imageUrl.startsWith('http')
    ? product.imageUrl
    : `${import.meta.env.VITE_API_URL || ''}${product.imageUrl}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 aspect-square bg-gray-100">
            {product.imageUrl ? (
              <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          <div className="p-6 md:w-1/2 flex flex-col justify-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide">{product.category}</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description || '—'}</p>
            <p className="text-xl font-bold text-primary mt-4">₹{product.price}</p>
            <button
              onClick={handleAdd}
              disabled={cartLoading}
              className="mt-6 w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
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

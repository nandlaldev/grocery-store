import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Cart() {
  const { items, loading, updateQty, remove } = useCart();
  const { token } = useAuth();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 mb-4">Please log in to view your cart.</p>
          <p className="text-sm text-gray-500">Click <strong>Account</strong> in the header → Login or Sign up.</p>
        </div>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/" className="inline-block px-4 py-2 rounded-lg bg-primary text-white font-medium">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cart</h1>
        <ul className="space-y-4">
          {items.map((i) => (
            <li
              key={i.productId}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4"
            >
              <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                {i.imageUrl ? (
                  <img
                    src={i.imageUrl.startsWith('http') ? i.imageUrl : `${import.meta.env.VITE_API_URL || ''}${i.imageUrl}`}
                    alt={i.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{i.name}</h3>
                <p className="text-primary font-semibold">₹{i.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQty(i.productId, Math.max(0, i.quantity - 1))}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{i.quantity}</span>
                  <button
                    onClick={() => updateQty(i.productId, i.quantity + 1)}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                  <button
                    onClick={() => remove(i.productId)}
                    className="ml-2 text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-left sm:text-right font-medium">
                ₹{(i.price * i.quantity).toFixed(0)}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span className="text-primary">₹{subtotal.toFixed(0)}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-4 block w-full py-3 rounded-lg bg-primary text-white text-center font-medium hover:bg-primary-dark"
          >
            Proceed to Checkout
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

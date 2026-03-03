import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<
    Array<{
      _id: string;
      items: Array<{ name: string; price: number; quantity: number }>;
      fullName: string;
      address: string;
      city: string;
      pincode: string;
      total: number;
      status: string;
      createdAt: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data } = await ordersApi.list();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 mb-4">Please log in to view orders.</p>
          <p className="text-sm text-gray-500">Click <strong>Account</strong> → Login or Sign up.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li key={o._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium text-primary">{o.status}</span>
                </div>
                <p className="font-medium text-gray-900 mt-1">
                  {o.items.length} item(s) · ₹{o.total}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {o.address}, {o.city} - {o.pincode}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

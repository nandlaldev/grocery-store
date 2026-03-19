import { useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { ticketsApi } from '../lib/api';

export default function Contact() {
  const { user } = useAuth();
  const initialForm = useMemo(
    () => ({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: '',
      subject: '',
      message: '',
    }),
    [user?.email, user?.fullName]
  );
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const { data, error: apiError } = await ticketsApi.create(form);
    setLoading(false);
    if (apiError) {
      setError(apiError);
      return;
    }
    setSuccess(`Ticket raised successfully. Ticket ID: ${data?.id || 'N/A'}`);
    setForm((prev) => ({ ...prev, subject: '', message: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8">
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-3 text-gray-600">
            Reach out for support, order help, or business inquiries. You can raise a support
            ticket below.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-5">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 lg:col-span-2">
              <h2 className="font-semibold text-gray-900">Customer Support</h2>
              <p className="mt-2 text-sm text-gray-600">support@grocery.com</p>
              <p className="text-sm text-gray-600">+91 98765 43210</p>
              <p className="text-sm text-gray-500 mt-2">Mon-Sat, 9:00 AM - 8:00 PM</p>

              <h2 className="font-semibold text-gray-900 mt-6">Office</h2>
              <p className="mt-2 text-sm text-gray-600">
                Grocery HQ, 2nd Floor, Market Plaza,
              </p>
              <p className="text-sm text-gray-600">Ahmedabad, Gujarat, India</p>
              <p className="text-sm text-gray-500 mt-2">We usually reply within 24 hours.</p>
            </div>

            <form
              onSubmit={onSubmit}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-5 lg:col-span-3 space-y-3"
            >
              <h2 className="font-semibold text-gray-900">Raise a Ticket</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-700">{success}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Raise Ticket'}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

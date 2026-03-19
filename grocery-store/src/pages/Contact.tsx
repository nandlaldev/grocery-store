import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8">
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-3 text-gray-600">
            Reach out for support, order help, or business inquiries.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h2 className="font-semibold text-gray-900">Customer Support</h2>
              <p className="mt-2 text-sm text-gray-600">support@grocery.com</p>
              <p className="text-sm text-gray-600">+91 98765 43210</p>
              <p className="text-sm text-gray-500 mt-2">Mon-Sat, 9:00 AM - 8:00 PM</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h2 className="font-semibold text-gray-900">Office</h2>
              <p className="mt-2 text-sm text-gray-600">
                Grocery HQ, 2nd Floor, Market Plaza,
              </p>
              <p className="text-sm text-gray-600">Ahmedabad, Gujarat, India</p>
              <p className="text-sm text-gray-500 mt-2">We usually reply within 24 hours.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

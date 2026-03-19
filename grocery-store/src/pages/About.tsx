import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8">
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">About Grocery</h1>
          <p className="mt-4 text-gray-600 leading-7 max-w-3xl">
            Grocery is built to make everyday shopping easy, quick, and reliable. We bring fresh
            products, transparent pricing, and smooth ordering together in one simple store
            experience.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h2 className="font-semibold text-gray-900">Fresh Selection</h2>
              <p className="mt-2 text-sm text-gray-600">
                Daily stocked essentials and quality grocery items for your home.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h2 className="font-semibold text-gray-900">Fast Ordering</h2>
              <p className="mt-2 text-sm text-gray-600">
                Clean product discovery, quick cart flow, and secure checkout.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h2 className="font-semibold text-gray-900">Customer First</h2>
              <p className="mt-2 text-sm text-gray-600">
                Responsive support and continuous improvements based on user feedback.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

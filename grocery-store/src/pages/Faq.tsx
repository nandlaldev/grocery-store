import Footer from '../components/Footer';
import Header from '../components/Header';

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Most orders are delivered the same day within available delivery slots.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Yes, you can cancel before the order is confirmed from the admin side.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'Currently cash on delivery is supported. More payment methods are coming soon.',
  },
  {
    q: 'How do I contact support?',
    a: 'Use the Contact page or email us at support@grocery.com.',
  },
];

export default function Faq() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8">
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">FAQ</h1>
          <p className="mt-3 text-gray-600">Quick answers to common questions.</p>

          <div className="mt-8 space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="group rounded-xl border border-gray-200 p-4 bg-gray-50">
                <summary className="cursor-pointer list-none font-medium text-gray-900 flex items-center justify-between gap-3">
                  {item.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <p className="mt-2 text-sm text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

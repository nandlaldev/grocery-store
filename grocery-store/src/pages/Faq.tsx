import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { faqApi } from '../lib/api';

export default function Faq() {
  const [faqs, setFaqs] = useState<Array<{ id: string; question: string; answer: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    faqApi.list().then(({ data }) => {
      setFaqs(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8">
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">FAQ</h1>
          <p className="mt-3 text-gray-600">Quick answers to common questions.</p>

          {loading ? (
            <p className="mt-8 text-gray-500">Loading FAQs...</p>
          ) : faqs.length === 0 ? (
            <p className="mt-8 text-gray-500">No FAQs available right now.</p>
          ) : (
            <div className="mt-8 space-y-3">
              {faqs.map((item) => (
                <details key={item.id} className="group rounded-xl border border-gray-200 p-4 bg-gray-50">
                  <summary className="cursor-pointer list-none font-medium text-gray-900 flex items-center justify-between gap-3">
                    {item.question}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">⌄</span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">{item.answer}</p>
                </details>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

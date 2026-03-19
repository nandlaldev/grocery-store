import Header from '../components/Header';
import Footer from '../components/Footer';

const members = [
  { name: 'Aarav Mehta', role: 'Operations Lead' },
  { name: 'Riya Sharma', role: 'Customer Success' },
  { name: 'Kabir Singh', role: 'Product & Experience' },
];

export default function Team() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8">
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Team</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            We are a focused team building a reliable and delightful grocery shopping experience.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <div key={m.name} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 text-primary font-semibold flex items-center justify-center">
                  {m.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <h2 className="mt-3 font-semibold text-gray-900">{m.name}</h2>
                <p className="text-sm text-gray-600">{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

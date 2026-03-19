import Header from '../components/Header';
import Footer from '../components/Footer';

const members = [
  {
    name: 'Aarav Mehta',
    role: 'Operations Lead',
    imageUrl: 'https://i.pravatar.cc/160?img=12',
    description:
      'Leads daily operations and ensures every order flow stays fast, reliable, and customer-first.',
  },
  {
    name: 'Riya Sharma',
    role: 'Customer Success',
    imageUrl: 'https://i.pravatar.cc/160?img=32',
    description:
      'Handles customer support and helps resolve issues quickly with a smooth, friendly experience.',
  },
  {
    name: 'Kabir Singh',
    role: 'Product & Experience',
    imageUrl: 'https://i.pravatar.cc/160?img=15',
    description:
      'Designs product journeys and improves usability so shopping feels simple on every screen.',
  },
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
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 bg-white shrink-0">
                    <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900">{m.name}</h2>
                    <p className="text-sm text-gray-600">{m.role}</p>
                    <p className="text-sm text-gray-500 mt-1 leading-5 line-clamp-2">{m.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

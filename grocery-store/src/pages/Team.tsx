import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { teamApi } from '../lib/api';

export default function Team() {
  const [members, setMembers] = useState<
    Array<{ id: string; name: string; role: string; description: string; imageUrl: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamApi.list().then(({ data }) => {
      setMembers(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8">
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Team</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            We are a focused team building a reliable and delightful grocery shopping experience.
          </p>

          {loading ? (
            <p className="mt-8 text-gray-500">Loading team...</p>
          ) : members.length === 0 ? (
            <p className="mt-8 text-gray-500">No team members added yet.</p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((m) => (
                <div key={m.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 bg-white shrink-0">
                      {m.imageUrl ? (
                        <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-gray-500">
                          {m.name
                            .split(' ')
                            .map((p) => p[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                      )}
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
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

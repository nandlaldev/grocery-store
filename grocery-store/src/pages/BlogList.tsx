import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogsApi } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function BlogList() {
  const [posts, setPosts] = useState<Array<{ _id: string; title: string; excerpt: string; imageUrl: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogsApi.list().then(({ data }) => {
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8">
        <section className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 sm:p-8">
          <p className="text-xs uppercase tracking-wider text-emerald-100">Insights & Updates</p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-1">Grocery Blog</h1>
          <p className="mt-2 text-emerald-50 max-w-2xl">
            Quick reads on products, shopping tips, and updates from our team.
          </p>
        </section>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse border border-gray-100">
                <div className="h-40 bg-gray-200 rounded-lg mb-3" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((p) => (
              <li key={p._id}>
                <Link
                  to={`/blog/${p._id}`}
                  className="group block h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  <div className="flex flex-col h-full">
                    {p.imageUrl ? (
                      <div className="h-44 bg-gray-100">
                        <img
                          src={p.imageUrl.startsWith('http') ? p.imageUrl : `${API_BASE}${p.imageUrl}`}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition"
                        />
                      </div>
                    ) : (
                      <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-xs text-primary font-semibold uppercase tracking-wide">Article</p>
                      <h2 className="text-lg font-semibold text-gray-900 mt-1 line-clamp-2">{p.title}</h2>
                      <p className="text-gray-600 mt-2 text-sm line-clamp-3 flex-1">
                        {p.excerpt || 'Read this post for complete details.'}
                      </p>
                      <p className="text-sm text-gray-400 mt-3">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}

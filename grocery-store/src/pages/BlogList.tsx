import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogsApi } from '../lib/api';
import Header from '../components/Header';

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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Blog</h1>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((p) => (
              <li key={p._id}>
                <Link
                  to={`/blog/${p._id}`}
                  className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row">
                    {p.imageUrl ? (
                      <div className="sm:w-48 h-40 sm:h-auto sm:min-h-[140px] flex-shrink-0 bg-gray-100">
                        <img
                          src={p.imageUrl.startsWith('http') ? p.imageUrl : `${API_BASE}${p.imageUrl}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="p-4 flex-1">
                      <h2 className="text-xl font-semibold text-gray-900">{p.title}</h2>
                      <p className="text-gray-600 mt-1 line-clamp-2">{p.excerpt || 'No excerpt.'}</p>
                      <p className="text-sm text-gray-400 mt-2">
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
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogsApi } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<{
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    blogsApi.get(id).then(({ data }) => {
      setPost(data || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
            <div className="h-64 bg-gray-200 rounded-xl mb-6" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Post not found.</p>
          <Link to="/blog" className="text-primary font-medium mt-2 inline-block">
            Back to Blog
          </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
        <Link to="/blog" className="text-primary font-medium text-sm mb-4 inline-flex items-center gap-1">
          ← Back to Blog
        </Link>
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {post.imageUrl && (
            <div className="aspect-[16/7] bg-gray-100">
              <img
                src={post.imageUrl.startsWith('http') ? post.imageUrl : `${API_BASE}${post.imageUrl}`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 sm:p-8 md:p-10">
            <p className="text-xs text-primary font-semibold uppercase tracking-wide">Blog Article</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-1">{post.title}</h1>
            <p className="text-gray-500 text-sm mt-2">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                dateStyle: 'long',
              })}
            </p>
            {post.excerpt && (
              <p className="text-gray-700 mt-5 text-lg border-b border-gray-100 pb-5 leading-8">
                {post.excerpt}
              </p>
            )}
            <div
              className="blog-content mt-6 prose prose-gray prose-headings:text-gray-900 prose-p:text-gray-700 max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
        </div>
      </main>
      <style>{`
        .blog-content p { margin-bottom: 1rem; }
        .blog-content ul, .blog-content ol { margin: 1rem 0; padding-left: 1.5rem; }
        .blog-content a { color: #059669; text-decoration: underline; }
        .blog-content blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 1rem 0; color: #6b7280; }
        .blog-content h2, .blog-content h3 { margin-top: 1.25rem; margin-bottom: 0.5rem; }
        .blog-content img { border-radius: 0.75rem; }
        .blog-content pre { background: #0f172a; color: #e2e8f0; padding: 0.9rem 1rem; border-radius: 0.75rem; overflow: auto; }
      `}</style>
      <Footer />
    </div>
  );
}

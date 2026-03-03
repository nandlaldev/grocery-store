import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogsApi } from '../lib/api';
import Header from '../components/Header';

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
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
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
        <main className="max-w-3xl mx-auto px-4 py-8">
          <p className="text-gray-500">Post not found.</p>
          <Link to="/blog" className="text-primary font-medium mt-2 inline-block">
            Back to Blog
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/blog" className="text-primary font-medium text-sm mb-4 inline-block">
          ← Back to Blog
        </Link>
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {post.imageUrl && (
            <div className="aspect-video bg-gray-100">
              <img
                src={post.imageUrl.startsWith('http') ? post.imageUrl : `${API_BASE}${post.imageUrl}`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{post.title}</h1>
            <p className="text-gray-500 text-sm mt-2">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                dateStyle: 'long',
              })}
            </p>
            {post.excerpt && (
              <p className="text-gray-600 mt-4 text-lg border-b border-gray-100 pb-4">
                {post.excerpt}
              </p>
            )}
            <div
              className="blog-content mt-6 prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>
      <style>{`
        .blog-content p { margin-bottom: 1rem; }
        .blog-content ul, .blog-content ol { margin: 1rem 0; padding-left: 1.5rem; }
        .blog-content a { color: #059669; text-decoration: underline; }
        .blog-content blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 1rem 0; color: #6b7280; }
      `}</style>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { token, user, setUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setFullName(user?.fullName || '');
    setPhone(user?.phone || '');
    setAvatarPreview(user?.avatarUrl || '');
    setAvatarFile(null);
  }, [user?.fullName, user?.phone, user?.avatarUrl]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const { data, error: apiError } = await authApi.updateProfile({
      fullName,
      phone,
      avatar: avatarFile,
    });

    setSaving(false);
    if (apiError) {
      setError(apiError);
      return;
    }

    if (data) {
      setUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        avatarUrl: data.avatarUrl || '',
        role: data.role,
      });
      setAvatarFile(null);
      setAvatarPreview(data.avatarUrl || avatarPreview);
      setSuccess('Profile updated successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-600 mt-1">View and update your account details.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <div className="flex items-center gap-3 mb-2">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">
                    {(fullName || user?.fullName || 'U')
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((s) => s[0]?.toUpperCase())
                      .join('') || 'U'}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setAvatarFile(f);
                    if (f) setAvatarPreview(URL.createObjectURL(f));
                  }}
                  className="text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {success ? <p className="text-sm text-green-600">{success}</p> : null}

            <div className="pt-1 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                to="/orders"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                My Orders
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

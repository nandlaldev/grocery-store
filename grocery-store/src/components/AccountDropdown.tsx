import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join('')
    : 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 flex items-center justify-center text-sm font-semibold"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {token && user ? (
          user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span>{initials}</span>
          )
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 py-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {token && user ? (
            <>
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <Link
                to="/profile"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/orders"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                My Orders
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-b-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

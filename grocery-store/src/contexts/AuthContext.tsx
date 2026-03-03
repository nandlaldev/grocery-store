import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

type User = { id: string; fullName: string; email: string; role: string } | null;

const AuthContext = createContext<{
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (fullName: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
  setUser: (u: User) => void;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    if (!token) return;
    import('../lib/api').then(({ authApi }) => {
      authApi.me().then(({ data }) => {
        if (data) setUser({ ...data, id: data.id });
      });
    });
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await import('../lib/api').then((m) => m.authApi.login({ email, password }));
    if (error) return error;
    if (data?.token && data.user) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ ...data.user, id: data.user.id });
      return null;
    }
    return 'Login failed';
  }, []);

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    const { data, error } = await import('../lib/api').then((m) =>
      m.authApi.register({ fullName, email, password })
    );
    if (error) return error;
    if (data?.token && data.user) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ ...data.user, id: data.user.id });
      return null;
    }
    return 'Registration failed';
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    import('../lib/api').then((m) => m.authApi.logout());
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

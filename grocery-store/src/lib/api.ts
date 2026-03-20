const API_BASE = import.meta.env.VITE_API_URL || '';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await res.text();
  let data: T | undefined;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    return { error: res.ok ? undefined : text || 'Request failed' };
  }

  if (!res.ok) {
    const err = (data as { error?: string })?.error || res.statusText || 'Request failed';
    return { error: err };
  }
  return { data: data as T };
}

export const authApi = {
  me: () =>
    api<{ id: string; fullName: string; email: string; role: string }>('/api/auth/me'),
  register: (body: { fullName: string; email: string; password: string }) =>
    api<{ user: { id: string; fullName: string; email: string; role: string }; token: string }>(
      '/api/auth/register',
      { method: 'POST', body: JSON.stringify(body) }
    ),
  login: (body: { email: string; password: string }) =>
    api<{ user: { id: string; fullName: string; email: string; role: string }; token: string }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify(body) }
    ),
  logout: () => api('/api/auth/logout', { method: 'POST' }),
};

export const productsApi = {
  list: (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: 'newest' | 'relevance' | 'price_asc' | 'price_desc';
  }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.sort) q.set('sort', params.sort);
    const query = q.toString();
    return api<{
      items: Array<{ _id: string; name: string; price: number; description: string; category: string; imageUrl: string }>;
      total: number;
      page: number;
      limit: number;
    }>(`/api/products${query ? `?${query}` : ''}`);
  },
  categories: () =>
    api<string[]>('/api/products/categories'),
  get: (id: string) =>
    api<{ _id: string; name: string; price: number; description: string; category: string; imageUrl: string }>(
      `/api/products/${id}`
    ),
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export const cartApi = {
  get: () => api<CartItem[]>('/api/cart'),
  add: (productId: string, quantity?: number) =>
    api<CartItem[]>('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: quantity ?? 1 }),
    }),
  update: (productId: string, quantity: number) =>
    api<CartItem[]>('/api/cart/' + productId, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  remove: (productId: string) =>
    api<CartItem[]>('/api/cart/' + productId, { method: 'DELETE' }),
};

export type BannerItem = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  order: number;
};

export const configApi = {
  get: () => api<{ banners: BannerItem[] }>('/api/config'),
};

export type BlogPost = {
  _id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  createdAt: string;
};

export const blogsApi = {
  list: () => api<BlogPost[]>('/api/blogs'),
  get: (id: string) => api<BlogPost>(`/api/blogs/${id}`),
};

export const ordersApi = {
  list: () =>
    api<
      Array<{
        _id: string;
        items: CartItem[];
        fullName: string;
        phone: string;
        address: string;
        city: string;
        pincode: string;
        subtotal: number;
        total: number;
        status: string;
      }>
    >('/api/orders'),
  create: (body: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  }) =>
    api<{ _id: string }>('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
};

export const ticketsApi = {
  create: (body: {
    fullName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) =>
    api<{ id: string; status: string; createdAt: string; message: string }>('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  order: number;
};

export const teamApi = {
  list: () => api<TeamMember[]>('/api/team'),
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export const faqApi = {
  list: () => api<FaqItem[]>('/api/faqs'),
};

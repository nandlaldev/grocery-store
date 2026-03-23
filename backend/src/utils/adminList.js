const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  return { page, limit, skip: (page - 1) * limit };
}

export function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function searchRegex(q) {
  const t = String(q || '').trim();
  if (!t) return null;
  return new RegExp(escapeRegex(t), 'i');
}

/**
 * @param {import('express').Request} req
 * @param {string[]} keys - query keys to preserve in pagination links
 */
export function paginationMeta(req, page, limit, total, keys) {
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const current = Math.min(Math.max(1, page), totalPages);

  function makeUrl(p) {
    const params = new URLSearchParams();
    for (const key of keys) {
      const v = req.query[key];
      if (v !== undefined && v !== '') params.set(key, String(v));
    }
    params.set('page', String(p));
    params.set('limit', String(limit));
    return `?${params.toString()}`;
  }

  const from = total === 0 ? 0 : (current - 1) * limit + 1;
  const to = Math.min(current * limit, total);

  return {
    page: current,
    limit,
    total,
    totalPages,
    from,
    to,
    prevUrl: current > 1 ? makeUrl(current - 1) : null,
    nextUrl: current < totalPages ? makeUrl(current + 1) : null,
    makeUrl,
  };
}

export function safeAdminRedirect(req, fallback = '/admin') {
  const ref = req.get('referer');
  if (!ref) return fallback;
  try {
    const u = new URL(ref);
    if (u.pathname.startsWith('/admin')) return ref;
  } catch (_) {
    /* ignore */
  }
  return fallback;
}

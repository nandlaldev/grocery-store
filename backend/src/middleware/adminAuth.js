import User from '../models/User.js';

export function requireAdminSession(req, res, next) {
  if (!req.session?.adminId) {
    return res.redirect('/admin/login');
  }
  next();
}

/** After requireAdminSession — sets res.locals.adminUser for header / profile */
export async function attachAdminUser(req, res, next) {
  if (!req.session?.adminId) {
    res.locals.adminUser = null;
    return next();
  }
  try {
    const user = await User.findById(req.session.adminId)
      .select('fullName email phone role avatarUrl')
      .lean();
    res.locals.adminUser = user && user.role === 'admin' ? user : null;
  } catch {
    res.locals.adminUser = null;
  }
  next();
}

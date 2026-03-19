import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Banner from '../models/Banner.js';
import Blog from '../models/Blog.js';

function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function getUploadedImageUrl(req) {
  const base = req.protocol + '://' + req.get('host');
  return req.file ? `${base}/uploads/${req.file.filename}` : '';
}

export function renderLogin(req, res) {
  if (req.session?.adminId) return res.redirect('/admin');
  return res.render('admin/login', { error: null });
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/login', { error: 'Invalid email or password' });
  }
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || user.role !== 'admin' || !(await user.comparePassword(req.body.password))) {
    return res.render('admin/login', { error: 'Invalid email or password' });
  }
  if (!req.session) req.session = {};
  req.session.adminId = user._id.toString();
  return res.redirect('/admin');
}

export function logout(req, res) {
  return req.session.destroy(() => res.redirect('/admin/login'));
}

export async function renderDashboard(_req, res) {
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return res.render('admin/dashboard', { products });
}

export async function renderNewProduct(_req, res) {
  const categories = await Product.distinct('category');
  return res.render('admin/product-form', { product: null, categories });
}

export async function renderEditProduct(req, res) {
  const product = await Product.findById(req.params.id).lean();
  if (!product) return res.redirect('/admin');
  const categories = await Product.distinct('category');
  return res.render('admin/product-form', { product, categories });
}

export async function createProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const categories = await Product.distinct('category');
    return res.render('admin/product-form', {
      product: null,
      categories,
      error: errors.array()[0]?.msg,
    });
  }
  const imageUrl = getUploadedImageUrl(req);
  await Product.create({
    name: req.body.name,
    price: Number(req.body.price),
    description: req.body.description || '',
    category: req.body.category,
    imageUrl,
  });
  return res.redirect('/admin');
}

export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/admin');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const categories = await Product.distinct('category');
    return res.render('admin/product-form', {
      product: product.toObject(),
      categories,
      error: errors.array()[0]?.msg,
    });
  }
  product.name = req.body.name;
  product.price = Number(req.body.price);
  product.description = req.body.description || '';
  product.category = req.body.category;
  if (req.file) {
    product.imageUrl = getUploadedImageUrl(req);
  }
  await product.save();
  return res.redirect('/admin');
}

export async function deleteProduct(req, res) {
  await Product.findByIdAndDelete(req.params.id);
  return res.redirect('/admin');
}

export async function renderUsers(_req, res) {
  const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
  return res.render('admin/users', { users });
}

export async function renderOrders(_req, res) {
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return res.render('admin/orders', { orders });
}

export async function updateOrderStatus(req, res) {
  const status = req.body.status;
  if (['pending', 'confirmed', 'delivered'].includes(status)) {
    await Order.findByIdAndUpdate(req.params.id, { status });
  }
  return res.redirect('/admin/orders');
}

export async function renderAppConfig(_req, res) {
  const banners = await Banner.find().sort({ order: 1, createdAt: 1 }).lean();
  return res.render('admin/app-config', { banners });
}

export function renderNewBanner(req, res) {
  return res.render('admin/banner-form', { banner: null, error: req.query.error || null });
}

export async function renderEditBanner(req, res) {
  const banner = await Banner.findById(req.params.id).lean();
  if (!banner) return res.redirect('/admin/app-config');
  return res.render('admin/banner-form', { banner });
}

export async function createBanner(req, res) {
  try {
    if (!req.file) {
      return res.redirect('/admin/banners/new?error=Image+required');
    }
    const count = await Banner.countDocuments();
    await Banner.create({
      imageUrl: getUploadedImageUrl(req),
      title: req.body.title || '',
      subtitle: req.body.subtitle || '',
      order: count,
    });
    return res.redirect('/admin/app-config');
  } catch (err) {
    return res.render('admin/banner-form', { banner: null, error: err.message });
  }
}

export async function updateBanner(req, res) {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.redirect('/admin/app-config');
  if (req.file) {
    banner.imageUrl = getUploadedImageUrl(req);
  }
  if (req.body.title !== undefined) banner.title = req.body.title || '';
  if (req.body.subtitle !== undefined) banner.subtitle = req.body.subtitle || '';
  if (req.body.order !== undefined) banner.order = parseInt(req.body.order, 10) || 0;
  await banner.save();
  return res.redirect('/admin/app-config');
}

export async function deleteBanner(req, res) {
  await Banner.findByIdAndDelete(req.params.id);
  return res.redirect('/admin/app-config');
}

export async function renderBlogs(_req, res) {
  const posts = await Blog.find().sort({ createdAt: -1 }).lean();
  return res.render('admin/blogs', { posts });
}

export function renderNewBlog(req, res) {
  return res.render('admin/blog-form', { post: null, error: req.query.error || null });
}

export async function renderEditBlog(req, res) {
  const post = await Blog.findById(req.params.id).lean();
  if (!post) return res.redirect('/admin/blogs');
  return res.render('admin/blog-form', { post });
}

export async function createBlog(req, res) {
  try {
    const title = (req.body.title || '').trim();
    if (!title) return res.redirect('/admin/blogs/new?error=Title+required');
    const imageUrl = getUploadedImageUrl(req);
    await Blog.create({
      title,
      slug: `${slugify(title)}-${Date.now()}`,
      excerpt: req.body.excerpt || '',
      content: req.body.content || '',
      imageUrl,
      status: req.body.status || 'published',
    });
    return res.redirect('/admin/blogs');
  } catch (err) {
    return res.render('admin/blog-form', { post: null, error: err.message });
  }
}

export async function updateBlog(req, res) {
  const post = await Blog.findById(req.params.id);
  if (!post) return res.redirect('/admin/blogs');
  const title = (req.body.title || '').trim();
  if (title) post.title = title;
  if (req.body.excerpt !== undefined) post.excerpt = req.body.excerpt || '';
  if (req.body.content !== undefined) post.content = req.body.content || '';
  if (req.body.status !== undefined) post.status = req.body.status || 'published';
  if (req.file) {
    post.imageUrl = getUploadedImageUrl(req);
  }
  await post.save();
  return res.redirect('/admin/blogs');
}

export async function deleteBlog(req, res) {
  await Blog.findByIdAndDelete(req.params.id);
  return res.redirect('/admin/blogs');
}

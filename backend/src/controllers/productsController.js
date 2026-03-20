import { validationResult } from 'express-validator';
import Product from '../models/Product.js';

function getImageUrl(req) {
  const base = req.protocol + '://' + req.get('host');
  return req.file ? `${base}/uploads/${req.file.filename}` : '';
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listProducts(req, res) {
  try {
    const { category, search } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 8));
    const skip = (page - 1) * limit;

    const sort = String(req.query.sort || 'newest');

    const filter = {};
    if (category) filter.category = new RegExp(escapeRegExp(category), 'i');
    if (search) filter.name = new RegExp(escapeRegExp(search), 'i');

    const total = await Product.countDocuments(filter);

    let items = [];

    if (sort === 'price_asc' || sort === 'price_desc') {
      const dir = sort === 'price_asc' ? 1 : -1;
      items = await Product.find(filter)
        .sort({ price: dir, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    } else if (sort === 'relevance' && search) {
      const escaped = escapeRegExp(search);
      items = await Product.aggregate([
        { $match: filter },
        {
          $addFields: {
            relevanceScore: {
              $cond: [
                { $regexMatch: { input: '$name', regex: '^' + escaped, options: 'i' } },
                1,
                0,
              ],
            },
          },
        },
        { $sort: { relevanceScore: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);
    } else {
      // newest/default
      items = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    }

    return res.json({ items, total, page, limit });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function listCategories(_req, res) {
  try {
    const categories = await Product.distinct('category');
    return res.json(categories.sort());
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createProduct(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]?.msg });
    }
    const imageUrl = getImageUrl(req);
    const product = await Product.create({
      name: req.body.name,
      price: Number(req.body.price),
      qty: req.body.qty !== undefined ? Number(req.body.qty) : 0,
      description: req.body.description || '',
      category: req.body.category,
      imageUrl,
    });
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]?.msg });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    product.name = req.body.name;
    product.price = Number(req.body.price);
    product.qty = req.body.qty !== undefined ? Number(req.body.qty) : product.qty;
    product.description = req.body.description || '';
    product.category = req.body.category;
    if (req.file) {
      product.imageUrl = getImageUrl(req);
    }
    await product.save();
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json({ deleted: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

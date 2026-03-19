import { validationResult } from 'express-validator';
import Product from '../models/Product.js';

function getImageUrl(req) {
  const base = req.protocol + '://' + req.get('host');
  return req.file ? `${base}/uploads/${req.file.filename}` : '';
}

export async function listProducts(req, res) {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = new RegExp(category, 'i');
    if (search) filter.name = new RegExp(search, 'i');
    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    return res.json(products);
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

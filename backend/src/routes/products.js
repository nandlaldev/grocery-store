import { Router } from 'express';
import Product from '../models/Product.js';
import { auth, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { body, validationResult } from 'express-validator';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = new RegExp(category, 'i');
    if (search) filter.name = new RegExp(search, 'i');
    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', async (_req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories.sort());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  auth,
  adminOnly,
  upload.single('image'),
  [
    body('name').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('description').optional().trim(),
    body('category').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0]?.msg });
      }
      const base = req.protocol + '://' + req.get('host');
      const imageUrl = req.file ? `${base}/uploads/${req.file.filename}` : '';
      const product = await Product.create({
        name: req.body.name,
        price: Number(req.body.price),
        description: req.body.description || '',
        category: req.body.category,
        imageUrl,
      });
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put(
  '/:id',
  auth,
  adminOnly,
  upload.single('image'),
  [
    body('name').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('description').optional().trim(),
    body('category').trim().notEmpty(),
  ],
  async (req, res) => {
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
        const base = req.protocol + '://' + req.get('host');
        product.imageUrl = `${base}/uploads/${req.file.filename}`;
      }
      await product.save();
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

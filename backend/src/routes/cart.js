import { Router } from 'express';
import Product from '../models/Product.js';
import { auth } from '../middleware/auth.js';
import { getCart } from '../store/cartStore.js';

const router = Router();

router.get('/', auth, (req, res) => {
  const items = getCart(req.userId);
  res.json(items);
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const cart = getCart(req.userId);
    const existing = cart.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.push({
        productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || '',
        quantity: Number(quantity),
      });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:productId', auth, (req, res) => {
  const { quantity } = req.body;
  const cart = getCart(req.userId);
  const item = cart.find((i) => i.productId === req.params.productId);
  if (!item) return res.status(404).json({ error: 'Item not in cart' });
  if (Number(quantity) <= 0) {
    const idx = cart.findIndex((i) => i.productId === req.params.productId);
    cart.splice(idx, 1);
    return res.json(cart);
  }
  item.quantity = Number(quantity);
  res.json(cart);
});

router.delete('/:productId', auth, (req, res) => {
  const cart = getCart(req.userId);
  const idx = cart.findIndex((i) => i.productId === req.params.productId);
  if (idx === -1) return res.status(404).json({ error: 'Item not in cart' });
  cart.splice(idx, 1);
  res.json(cart);
});

export default router;

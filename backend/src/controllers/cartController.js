import Product from '../models/Product.js';
import { getCart } from '../store/cartStore.js';

export function getCartItems(req, res) {
  const items = getCart(req.userId);
  return res.json(items);
}

export async function addToCart(req, res) {
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
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export function updateCartItem(req, res) {
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
  return res.json(cart);
}

export function removeCartItem(req, res) {
  const cart = getCart(req.userId);
  const idx = cart.findIndex((i) => i.productId === req.params.productId);
  if (idx === -1) return res.status(404).json({ error: 'Item not in cart' });
  cart.splice(idx, 1);
  return res.json(cart);
}

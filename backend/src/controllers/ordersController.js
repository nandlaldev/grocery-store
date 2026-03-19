import { validationResult } from 'express-validator';
import Order from '../models/Order.js';
import { getCart, clearCart } from '../store/cartStore.js';

export async function listOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createOrder(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]?.msg });
    }
    const cart = getCart(req.userId);
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    let subtotal = 0;
    const items = cart.map((i) => {
      const lineTotal = i.price * i.quantity;
      subtotal += lineTotal;
      return {
        product: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.imageUrl || '',
      };
    });
    const order = await Order.create({
      user: req.userId,
      items,
      fullName: req.body.fullName,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      pincode: req.body.pincode,
      subtotal,
      total: subtotal,
      status: 'pending',
    });
    clearCart(req.userId);
    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

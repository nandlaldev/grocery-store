import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import { auth } from '../middleware/auth.js';
import { getCart, clearCart } from '../store/cartStore.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  auth,
  [
    body('fullName').trim().notEmpty(),
    body('phone').trim().notEmpty(),
    body('address').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('pincode').trim().notEmpty(),
  ],
  async (req, res) => {
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
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;

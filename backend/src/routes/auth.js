import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('fullName').trim().notEmpty().withMessage('Full name required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0]?.msg, errors: errors.array() });
      }
      const { fullName, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      const user = await User.create({ fullName, email, password, role: 'customer' });
      const token = signToken(user._id);
      res.status(201).json({
        user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
        token,
      });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Registration failed' });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const token = signToken(user._id);
      res.json({
        user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
        token,
      });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Login failed' });
    }
  }
);

router.post('/logout', (_req, res) => {
  res.clearCookie('token').json({ ok: true });
});

router.get('/me', async (req, res) => {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace('Bearer ', '') ||
    req.headers?.authorization;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const jwt = (await import('jsonwebtoken')).default;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = await User.findById(decoded.userId).select('-password').lean();
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ id: user._id, fullName: user.fullName, email: user.email, role: user.role });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function register(req, res) {
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
    return res.status(201).json({
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
}

export async function login(req, res) {
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
    return res.json({
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
}

export function logout(_req, res) {
  return res.clearCookie('token').json({ ok: true });
}

export async function me(req, res) {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace('Bearer ', '') ||
    req.headers?.authorization;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password').lean();
    if (!user) return res.status(401).json({ error: 'User not found' });
    return res.json({ id: user._id, fullName: user.fullName, email: user.email, role: user.role });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

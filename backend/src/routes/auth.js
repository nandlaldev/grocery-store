import { Router } from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { login, logout, me, register, updateProfile } from '../controllers/authController.js';

const router = Router();

router.post(
  '/register',
  [
    body('fullName').trim().notEmpty().withMessage('Full name required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password at least 6 characters'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  login
);

router.post('/logout', logout);

router.get('/me', me);

router.put(
  '/profile',
  auth,
  upload.single('avatar'),
  [body('fullName').trim().notEmpty().withMessage('Full name required'), body('phone').optional().trim()],
  updateProfile
);

export default router;

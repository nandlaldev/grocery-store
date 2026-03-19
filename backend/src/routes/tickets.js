import { Router } from 'express';
import { body } from 'express-validator';
import { optionalAuth } from '../middleware/auth.js';
import { createTicket } from '../controllers/ticketsController.js';

const router = Router();

router.post(
  '/',
  optionalAuth,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Message should be at least 10 characters'),
  ],
  createTicket
);

export default router;

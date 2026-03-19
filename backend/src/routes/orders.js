import { Router } from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { createOrder, listOrders } from '../controllers/ordersController.js';

const router = Router();

router.get('/', auth, listOrders);

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
  createOrder
);

export default router;

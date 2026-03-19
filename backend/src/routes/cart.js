import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  addToCart,
  getCartItems,
  removeCartItem,
  updateCartItem,
} from '../controllers/cartController.js';

const router = Router();

router.get('/', auth, getCartItems);

router.post('/', auth, addToCart);

router.put('/:productId', auth, updateCartItem);

router.delete('/:productId', auth, removeCartItem);

export default router;

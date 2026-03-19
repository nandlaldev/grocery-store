import { Router } from 'express';
import { auth, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { body } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listCategories,
  listProducts,
  updateProduct,
} from '../controllers/productsController.js';

const router = Router();

router.get('/', listProducts);

router.get('/categories', listCategories);

router.get('/:id', getProductById);

router.post(
  '/',
  auth,
  adminOnly,
  upload.single('image'),
  [
    body('name').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('qty').optional().isInt({ min: 0 }),
    body('description').optional().trim(),
    body('category').trim().notEmpty(),
  ],
  createProduct
);

router.put(
  '/:id',
  auth,
  adminOnly,
  upload.single('image'),
  [
    body('name').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('qty').optional().isInt({ min: 0 }),
    body('description').optional().trim(),
    body('category').trim().notEmpty(),
  ],
  updateProduct
);

router.delete('/:id', auth, adminOnly, deleteProduct);

export default router;

import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js';

const router = Router();

router.use(auth);

router.get('/', getWishlist);
router.post('/:productId/toggle', toggleWishlist);

export default router;

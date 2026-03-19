import { Router } from 'express';
import { body } from 'express-validator';
import { upload } from '../middleware/upload.js';
import { requireAdminSession } from '../middleware/adminAuth.js';
import {
  createBanner,
  createBlog,
  createProduct,
  deleteBanner,
  deleteBlog,
  deleteProduct,
  login,
  logout,
  renderAppConfig,
  renderBlogs,
  renderDashboard,
  renderEditBanner,
  renderEditBlog,
  renderEditProduct,
  renderLogin,
  renderNewBanner,
  renderNewBlog,
  renderNewProduct,
  renderOrders,
  renderTeams,
  renderUsers,
  updateBanner,
  updateBlog,
  updateOrderStatus,
  updateTeam,
  updateProduct,
  createTeam,
  deleteTeam,
  renderEditTeam,
  renderNewTeam,
} from '../controllers/adminController.js';

const router = Router();

router.get('/login', renderLogin);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  login
);

router.get('/logout', logout);

router.get('/', requireAdminSession, renderDashboard);
router.get('/products/new', requireAdminSession, renderNewProduct);
router.get('/products/edit/:id', requireAdminSession, renderEditProduct);

router.post(
  '/products',
  requireAdminSession,
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

router.post(
  '/products/:id',
  requireAdminSession,
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

router.post('/products/:id/delete', requireAdminSession, deleteProduct);
router.get('/users', requireAdminSession, renderUsers);
router.get('/orders', requireAdminSession, renderOrders);
router.post('/orders/:id/status', requireAdminSession, updateOrderStatus);
router.get('/app-config', requireAdminSession, renderAppConfig);
router.get('/banners/new', requireAdminSession, renderNewBanner);
router.get('/banners/edit/:id', requireAdminSession, renderEditBanner);
router.post('/banners', requireAdminSession, upload.single('banner'), createBanner);
router.post('/banners/:id', requireAdminSession, upload.single('banner'), updateBanner);
router.post('/banners/:id/delete', requireAdminSession, deleteBanner);
router.get('/blogs', requireAdminSession, renderBlogs);
router.get('/blogs/new', requireAdminSession, renderNewBlog);
router.get('/blogs/edit/:id', requireAdminSession, renderEditBlog);
router.post('/blogs', requireAdminSession, upload.single('image'), createBlog);
router.post('/blogs/:id', requireAdminSession, upload.single('image'), updateBlog);
router.post('/blogs/:id/delete', requireAdminSession, deleteBlog);
router.get('/team', requireAdminSession, renderTeams);
router.get('/team/new', requireAdminSession, renderNewTeam);
router.get('/team/edit/:id', requireAdminSession, renderEditTeam);
router.post('/team', requireAdminSession, upload.single('image'), createTeam);
router.post('/team/:id', requireAdminSession, upload.single('image'), updateTeam);
router.post('/team/:id/delete', requireAdminSession, deleteTeam);

export default router;

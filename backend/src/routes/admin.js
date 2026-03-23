import { Router } from 'express';
import { body } from 'express-validator';
import { upload } from '../middleware/upload.js';
import { requireAdminSession, attachAdminUser } from '../middleware/adminAuth.js';
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
  createFaq,
  deleteFaq,
  deleteTeam,
  renderEditFaq,
  renderEditTeam,
  renderFaqs,
  renderNewFaq,
  renderNewTeam,
  updateFaq,
  renderFooterConfig,
  saveFooterConfig,
  removeFooterConfig,
  renderAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
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

const secured = Router();
secured.use(requireAdminSession, attachAdminUser);

secured.get('/', renderDashboard);
secured.get('/products/new', renderNewProduct);
secured.get('/products/edit/:id', renderEditProduct);

secured.post(
  '/products',
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

secured.post(
  '/products/:id',
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

secured.post('/products/:id/delete', deleteProduct);
secured.get('/users', renderUsers);
secured.get('/orders', renderOrders);
secured.post('/orders/:id/status', updateOrderStatus);
secured.get('/app-config', renderAppConfig);
secured.get('/banners/new', renderNewBanner);
secured.get('/banners/edit/:id', renderEditBanner);
secured.post('/banners', upload.single('banner'), createBanner);
secured.post('/banners/:id', upload.single('banner'), updateBanner);
secured.post('/banners/:id/delete', deleteBanner);
secured.get('/blogs', renderBlogs);
secured.get('/blogs/new', renderNewBlog);
secured.get('/blogs/edit/:id', renderEditBlog);
secured.post('/blogs', upload.single('image'), createBlog);
secured.post('/blogs/:id', upload.single('image'), updateBlog);
secured.post('/blogs/:id/delete', deleteBlog);
secured.get('/team', renderTeams);
secured.get('/team/new', renderNewTeam);
secured.get('/team/edit/:id', renderEditTeam);
secured.post('/team', upload.single('image'), createTeam);
secured.post('/team/:id', upload.single('image'), updateTeam);
secured.post('/team/:id/delete', deleteTeam);
secured.get('/faqs', renderFaqs);
secured.get('/faqs/new', renderNewFaq);
secured.get('/faqs/edit/:id', renderEditFaq);
secured.post('/faqs', createFaq);
secured.post('/faqs/:id', updateFaq);
secured.post('/faqs/:id/delete', deleteFaq);

secured.get('/app-config/footer', renderFooterConfig);
secured.post('/app-config/footer', saveFooterConfig);
secured.post('/app-config/footer/delete', removeFooterConfig);

secured.get('/profile', renderAdminProfile);
secured.post('/profile', upload.single('avatar'), updateAdminProfile);
secured.post('/profile/password', updateAdminPassword);

router.use('/', secured);

export default router;

import { Router } from 'express';
import { getPublishedBlogById, listPublishedBlogs } from '../controllers/blogsController.js';

const router = Router();

router.get('/', listPublishedBlogs);

router.get('/:id', getPublishedBlogById);

export default router;

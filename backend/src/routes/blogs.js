import { Router } from 'express';
import Blog from '../models/Blog.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const posts = await Blog.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .select('title slug excerpt imageUrl createdAt')
      .lean();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Blog.findOne({
      _id: req.params.id,
      status: 'published',
    }).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

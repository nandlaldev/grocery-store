import Blog from '../models/Blog.js';

export async function listPublishedBlogs(_req, res) {
  try {
    const posts = await Blog.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .select('title slug excerpt imageUrl createdAt')
      .lean();
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getPublishedBlogById(req, res) {
  try {
    const post = await Blog.findOne({
      _id: req.params.id,
      status: 'published',
    }).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

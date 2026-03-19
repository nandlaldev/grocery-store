import Banner from '../models/Banner.js';

export async function getAppConfig(_req, res) {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: 1 }).lean();
    return res.json({
      banners: banners.map((b) => ({
        id: b._id,
        imageUrl: b.imageUrl || '',
        title: b.title || '',
        subtitle: b.subtitle || '',
        order: b.order ?? 0,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

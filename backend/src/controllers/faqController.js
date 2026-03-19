import Faq from '../models/Faq.js';

export async function listFaqs(_req, res) {
  try {
    const faqs = await Faq.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean();
    return res.json(
      faqs.map((f) => ({
        id: f._id,
        question: f.question,
        answer: f.answer,
        order: f.order ?? 0,
      }))
    );
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to load FAQs' });
  }
}

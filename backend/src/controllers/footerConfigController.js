import FooterConfig from '../models/FooterConfig.js';

export async function getFooterConfig(_req, res) {
  try {
    const config = await FooterConfig.findOne({}).sort({ createdAt: -1 }).lean();
    return res.json(config || null);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to load footer config' });
  }
}

export async function upsertFooterConfig(req, res) {
  try {
    const quickLinksLines = String(req.body.quickLinks || '');
    const supportLinksLines = String(req.body.supportLinks || '');

    const quickLinks = quickLinksLines
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [rawLabel, rawHref] = line.split('|');
        const label = String(rawLabel || '').trim();
        const href = String(rawHref || '/').trim();
        if (!label) return null;
        return { label, href };
      })
      .filter(Boolean);

    const supportLinks = supportLinksLines
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const update = {
      brandName: (req.body.brandName || 'Grocery').trim(),
      brandDescription: (req.body.brandDescription || '').trim(),

      supportEmail: (req.body.supportEmail || '').trim().toLowerCase(),
      supportPhone: (req.body.supportPhone || '').trim(),
      supportHours: (req.body.supportHours || '').trim(),
      social: {
        facebookUrl: (req.body.facebookUrl || '').trim(),
        instagramUrl: (req.body.instagramUrl || '').trim(),
        twitterUrl: (req.body.twitterUrl || '').trim(),
        youtubeUrl: (req.body.youtubeUrl || '').trim(),
      },
    };

    // Only overwrite arrays when admin provides values.
    if (quickLinks.length) update.quickLinks = quickLinks;
    if (supportLinks.length) update.supportLinks = supportLinks;

    const existing = await FooterConfig.findOne({}).sort({ createdAt: -1 });
    if (existing) {
      await FooterConfig.updateOne({ _id: existing._id }, update);
    } else {
      await FooterConfig.create(update);
    }

    return res.redirect('/admin/app-config/footer?ok=1');
  } catch (err) {
    return res.redirect(`/admin/app-config/footer?error=${encodeURIComponent(err.message || 'Failed to save')}`);
  }
}

export async function deleteFooterConfig(_req, res) {
  try {
    await FooterConfig.deleteMany({});
    return res.redirect('/admin/app-config/footer?deleted=1');
  } catch (err) {
    return res.redirect(`/admin/app-config/footer?error=${encodeURIComponent(err.message || 'Failed to delete')}`);
  }
}


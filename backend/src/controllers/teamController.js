import Team from '../models/Team.js';

export async function listTeamMembers(_req, res) {
  try {
    const members = await Team.find({ active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return res.json(
      members.map((m) => ({
        id: m._id,
        name: m.name,
        role: m.role,
        description: m.description || '',
        imageUrl: m.imageUrl || '',
        order: m.order ?? 0,
      }))
    );
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to load team' });
  }
}

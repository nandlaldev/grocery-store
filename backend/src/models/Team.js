import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    imageUrl: { type: String, default: '' },
    order: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Team', teamSchema);

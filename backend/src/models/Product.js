import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);

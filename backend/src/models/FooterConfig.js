import mongoose from 'mongoose';

const footerConfigSchema = new mongoose.Schema(
  {
    brandName: { type: String, default: 'Grocery', trim: true },
    brandDescription: { type: String, default: '', trim: true },

    quickLinks: [
      {
        label: { type: String, default: '', trim: true },
        href: { type: String, default: '/', trim: true },
      },
    ],
    supportLinks: [{ type: String, default: '', trim: true }],

    supportEmail: { type: String, default: '', trim: true, lowercase: true },
    supportPhone: { type: String, default: '', trim: true },
    supportHours: { type: String, default: '', trim: true },

    social: {
      facebookUrl: { type: String, default: '', trim: true },
      instagramUrl: { type: String, default: '', trim: true },
      twitterUrl: { type: String, default: '', trim: true },
      youtubeUrl: { type: String, default: '', trim: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model('FooterConfig', footerConfigSchema);


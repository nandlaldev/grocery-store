import mongoose from 'mongoose';

const appConfigSchema = new mongoose.Schema(
  {
    homeBannerUrl: { type: String, default: '' },
    homeBannerTitle: { type: String, default: '' },
    homeBannerSubtitle: { type: String, default: '' },
  },
  { timestamps: true }
);

// Single document for app config
export default mongoose.model('AppConfig', appConfigSchema);

import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Wishlist from '../models/Wishlist.js';

export async function getWishlist(req, res) {
  const wishlist = await Wishlist.findOne({ user: req.userId })
    .populate({
      path: 'products',
      select: 'name price description category imageUrl createdAt',
      options: { sort: { createdAt: -1 } },
    })
    .lean();

  const products = Array.isArray(wishlist?.products) ? wishlist.products : [];
  const productIds = products.map((p) => String(p._id));

  return res.json({ products, productIds });
}

export async function toggleWishlist(req, res) {
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ error: 'Invalid product id' });
  }

  const exists = await Product.exists({ _id: productId });
  if (!exists) return res.status(404).json({ error: 'Product not found' });

  let wishlist = await Wishlist.findOne({ user: req.userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.userId, products: [] });
  }

  const pid = String(productId);
  const hasProduct = wishlist.products.some((p) => String(p) === pid);

  if (hasProduct) {
    wishlist.products = wishlist.products.filter((p) => String(p) !== pid);
  } else {
    wishlist.products.push(productId);
  }

  await wishlist.save();

  return res.json({
    ok: true,
    inWishlist: !hasProduct,
    productIds: wishlist.products.map((p) => String(p)),
  });
}

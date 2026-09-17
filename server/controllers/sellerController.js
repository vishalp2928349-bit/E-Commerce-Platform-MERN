import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc    Get seller dashboard stats
// @route   GET /api/seller/stats
// @access  Private/Seller
export const getSellerStats = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  // All products belonging to this seller
  const myProducts = await Product.find({ seller: sellerId }).select("_id");
  const myProductIds = myProducts.map((p) => p._id);

  const totalProducts = myProducts.length;

  // Orders that contain at least one of the seller's products
  const orders = await Order.find({
    "products.product": { $in: myProductIds },
  });

  const totalOrders = orders.length;

  // Revenue: sum totalAmount of paid orders containing seller's products
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === "processing").length;

  res.json({
    success: true,
    data: { totalProducts, totalOrders, totalRevenue, pendingOrders },
  });
});

// @desc    Get seller's own products
// @route   GET /api/seller/products
// @access  Private/Seller
export const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id })
    .populate("category", "name")
    .sort("-createdAt");

  res.json({ success: true, count: products.length, data: products });
});

// @desc    Get orders containing seller's products
// @route   GET /api/seller/orders
// @access  Private/Seller
export const getSellerOrders = asyncHandler(async (req, res) => {
  const myProducts = await Product.find({ seller: req.user._id }).select("_id");
  const myProductIds = myProducts.map((p) => p._id);

  const orders = await Order.find({
    "products.product": { $in: myProductIds },
  })
    .populate("user", "name email")
    .sort("-createdAt");

  res.json({ success: true, count: orders.length, data: orders });
});

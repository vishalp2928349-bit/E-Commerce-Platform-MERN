import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// @desc    Get all customers (admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort("-createdAt");
  res.json({ success: true, count: users.length, data: users });
});

// @desc    Delete a user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.json({ success: true, message: "User removed" });
});

// @desc    Admin dashboard summary stats
// @route   GET /api/users/stats/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const Product = (await import("../models/Product.js")).default;
  const Order = (await import("../models/Order.js")).default;

  const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.find({ paymentStatus: "paid" }),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  res.json({
    success: true,
    data: { totalUsers, totalProducts, totalOrders, totalRevenue },
  });
});

// @desc    Buyer's personal stats
// @route   GET /api/users/stats/buyer
// @access  Private
export const getBuyerStats = asyncHandler(async (req, res) => {
  const Order = (await import("../models/Order.js")).default;
  const Wishlist = (await import("../models/Wishlist.js")).default;

  const [myOrders, wishlist] = await Promise.all([
    Order.find({ user: req.user._id }),
    Wishlist.findOne({ user: req.user._id }),
  ]);

  const totalOrders = myOrders.length;
  const totalSpent = myOrders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrders = myOrders.filter((o) =>
    ["processing", "shipped"].includes(o.orderStatus)
  ).length;
  const wishlistItems = wishlist?.products?.length || 0;

  res.json({
    success: true,
    data: { totalOrders, totalSpent, activeOrders, wishlistItems },
  });
});

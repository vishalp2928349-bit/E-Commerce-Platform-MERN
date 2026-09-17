import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, expiryDate } = req.body;
  const exists = await Coupon.findOne({ code: code.toUpperCase() });
  if (exists) {
    res.status(400);
    throw new Error("Coupon code already exists");
  }
  const coupon = await Coupon.create({ code: code.toUpperCase(), discount, expiryDate });
  res.status(201).json({ success: true, data: coupon });
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort("-createdAt");
  res.json({ success: true, data: coupons });
});

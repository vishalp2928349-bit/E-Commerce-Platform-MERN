import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc    Add a review to a product
// @route   POST /api/reviews/:productId
// @access  Private
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: "Review added" });
});

// @desc    Update own review
// @route   PUT /api/reviews/:productId/:reviewId
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const review = product.reviews.id(req.params.reviewId);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to edit this review");
  }

  review.rating = req.body.rating ?? review.rating;
  review.comment = req.body.comment ?? review.comment;
  product.rating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

  await product.save();
  res.json({ success: true, message: "Review updated" });
});

// @desc    Delete own review (or any review if admin)
// @route   DELETE /api/reviews/:productId/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const review = product.reviews.id(req.params.reviewId);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  if (req.user.role !== "admin" && review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  await review.deleteOne();
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  await product.save();
  res.json({ success: true, message: "Review deleted" });
});

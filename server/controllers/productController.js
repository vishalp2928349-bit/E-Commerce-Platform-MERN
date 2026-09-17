import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import ApiFeatures from "../utils/apiFeatures.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all products (search, filter, sort, paginate)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  // Bug #6 fix: build the filter separately so countDocuments receives a plain filter object,
  // not a Mongoose Query chain (which behaves incorrectly in Mongoose 8).
  const countFeatures = new ApiFeatures(Product.find(), req.query).search().filter();
  const total = await Product.countDocuments(countFeatures.query.getFilter());

  const features = new ApiFeatures(Product.find().populate("category", "name"), req.query)
    .search()
    .filter()
    .sort()
    .paginate();

  const products = await features.query;
  const limit = Number(req.query.limit) || 12;

  res.json({
    success: true,
    count: products.length,
    total,
    page: Number(req.query.page) || 1,
    pages: Math.ceil(total / limit),
    data: products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name");
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, data: product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin or Seller
export const createProduct = asyncHandler(async (req, res) => {
  // Auto-assign the logged-in user as the seller
  const product = await Product.create({ ...req.body, seller: req.user._id });
  res.status(201).json({ success: true, data: product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin or Seller (own products only)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Sellers can only edit their own products; admins can edit any
  if (req.user.role === "seller" && String(product.seller) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to edit this product");
  }

  Object.assign(product, req.body);
  const updated = await product.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin or Seller (own products only)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Sellers can only delete their own products; admins can delete any
  if (req.user.role === "seller" && String(product.seller) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to delete this product");
  }

  for (const img of product.images) {
    if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
  }

  await product.deleteOne();
  res.json({ success: true, message: "Product removed" });
});

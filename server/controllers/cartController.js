import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

// @desc    Get logged-in user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate("products.product", "title price images stock");
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, products: [] });
  }
  res.json({ success: true, data: cart });
});

// @desc    Add item to cart (or increase quantity if it already exists)
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, products: [] });

  const existingItem = cart.products.find((p) => p.product.toString() === productId);

  // Bug #14 fix: check cumulative quantity (existing + new) against available stock
  const currentQty = existingItem ? existingItem.quantity : 0;
  if (product.stock < currentQty + Number(quantity)) {
    res.status(400);
    throw new Error("Not enough stock available");
  }

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.products.push({ product: productId, quantity, price: product.price });
  }

  await cart.save();
  const populated = await cart.populate("products.product", "title price images stock");
  res.status(201).json({ success: true, data: populated });
});

// @desc    Update quantity of a cart item
// @route   PUT /api/cart/:id  (:id = product id)
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.products.find((p) => p.product.toString() === req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Item not in cart");
  }

  if (quantity <= 0) {
    cart.products = cart.products.filter((p) => p.product.toString() !== req.params.id);
  } else {
    // Bug #7 fix: validate requested quantity against available stock
    const product = await Product.findById(req.params.id).select("stock");
    if (product && quantity > product.stock) {
      res.status(400);
      throw new Error(`Only ${product.stock} item(s) available in stock`);
    }
    item.quantity = quantity;
  }

  await cart.save();
  const populated = await cart.populate("products.product", "title price images stock");
  res.json({ success: true, data: populated });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id (:id = product id)
// @access  Private
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }
  cart.products = cart.products.filter((p) => p.product.toString() !== req.params.id);
  await cart.save();

  // Bug #4 fix: populate before sending response so frontend can access product fields
  const populated = await cart.populate("products.product", "title price images stock");
  res.json({ success: true, data: populated });
});

// @desc    Apply a coupon code to the cart
// @route   POST /api/cart/apply-coupon
// @access  Private
export const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon || coupon.expiryDate < new Date()) {
    res.status(400);
    throw new Error("Invalid or expired coupon");
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.coupon = { code: coupon.code, discount: coupon.discount };
  await cart.save();
  res.json({ success: true, data: cart });
});

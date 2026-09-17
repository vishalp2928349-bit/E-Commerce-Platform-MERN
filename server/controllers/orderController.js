import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Create a new order from the user's cart
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate("products.product");
  if (!cart || cart.products.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  // Bug #8 fix: validate stock for every item BEFORE creating the order
  for (const item of cart.products) {
    const product = item.product;
    if (!product) {
      res.status(400);
      throw new Error("One or more products in your cart no longer exist");
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(
        `"${product.title}" only has ${product.stock} unit(s) in stock but you ordered ${item.quantity}`
      );
    }
  }

  const itemsPrice = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = cart.coupon?.discount ? (itemsPrice * cart.coupon.discount) / 100 : 0;
  const totalAmount = itemsPrice - discountAmount;

  const orderItems = cart.products.map((item) => ({
    product: item.product._id,
    title: item.product.title,
    image: item.product.images?.[0]?.url || "",
    quantity: item.quantity,
    price: item.price,
  }));

  const order = await Order.create({
    user: req.user._id,
    products: orderItems,
    shippingAddress,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "pending",
    itemsPrice,
    discountAmount,
    totalAmount,
    orderStatus: "processing",
  });

  // Decrement stock for each purchased product (stock already validated above)
  for (const item of cart.products) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  // Clear the cart
  cart.products = [];
  cart.coupon = { code: "", discount: 0 };
  await cart.save();

  res.status(201).json({ success: true, data: order });
});

// @desc    Get logged-in user's orders (or all orders if admin)
// @route   GET /api/orders
// @access  Private
export const getOrders = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user._id };
  const orders = await Order.find(filter).populate("user", "name email").sort("-createdAt");
  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Get single order by id
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }
  res.json({ success: true, data: order });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.orderStatus = req.body.orderStatus || order.orderStatus;
  if (req.body.orderStatus === "delivered") order.deliveredAt = new Date();
  const updated = await order.save();
  res.json({ success: true, data: updated });
});

// @desc    Mark order as paid (dummy payment)
// @route   PUT /api/orders/:id/pay
// @access  Private
export const payOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  // Only the owner can pay for their order
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to pay for this order");
  }
  if (order.paymentStatus === "paid") {
    res.status(400);
    throw new Error("Order is already paid");
  }

  order.paymentStatus = "paid";
  order.paymentMethod = req.body.paymentMethod || "Dummy Card";
  order.paymentResult = {
    id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: "COMPLETED",
    update_time: new Date().toISOString(),
  };

  const updated = await order.save();
  res.json({ success: true, data: updated });
});

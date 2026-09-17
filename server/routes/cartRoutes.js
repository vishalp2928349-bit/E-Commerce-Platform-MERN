import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.post("/apply-coupon", protect, applyCoupon);
router.put("/:id", protect, updateCartItem);
router.delete("/:id", protect, removeCartItem);

export default router;

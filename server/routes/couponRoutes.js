import express from "express";
import { createCoupon, getCoupons } from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getCoupons);
router.post("/", protect, admin, createCoupon);

export default router;

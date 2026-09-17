import express from "express";
import { getSellerStats, getSellerProducts, getSellerOrders } from "../controllers/sellerController.js";
import { protect, seller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, seller, getSellerStats);
router.get("/products", protect, seller, getSellerProducts);
router.get("/orders", protect, seller, getSellerOrders);

export default router;

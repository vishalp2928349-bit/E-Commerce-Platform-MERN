import express from "express";
import { createOrder, getOrders, getOrderById, updateOrderStatus, payOrder } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getOrders);
router.post("/", protect, createOrder);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, payOrder);
router.put("/:id", protect, admin, updateOrderStatus);

export default router;

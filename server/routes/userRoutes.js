import express from "express";
import { getUsers, deleteUser, getDashboardStats, getBuyerStats } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getUsers);
router.get("/stats/dashboard", protect, admin, getDashboardStats);
router.get("/stats/buyer", protect, getBuyerStats);
router.delete("/:id", protect, admin, deleteUser);

export default router;

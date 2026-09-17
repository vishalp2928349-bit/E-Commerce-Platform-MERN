import express from "express";
import { addReview, updateReview, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { reviewRules, validate } from "../middleware/validators.js";

const router = express.Router();

router.post("/:productId", protect, reviewRules, validate, addReview);
router.put("/:productId/:reviewId", protect, updateReview);
router.delete("/:productId/:reviewId", protect, deleteReview);

export default router;

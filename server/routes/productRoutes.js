import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin, seller } from "../middleware/authMiddleware.js";
import { productRules, validate } from "../middleware/validators.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, seller, productRules, validate, createProduct);
router.put("/:id", protect, seller, updateProduct);
router.delete("/:id", protect, seller, deleteProduct);

export default router;

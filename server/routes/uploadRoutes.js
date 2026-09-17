import express from "express";
import { uploadImages } from "../controllers/uploadController.js";
import { protect, seller } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, seller, upload.array("images", 6), uploadImages);

export default router;

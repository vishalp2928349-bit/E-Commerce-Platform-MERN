import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort("name");
  res.json({ success: true, data: categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const exists = await Category.findOne({ name: req.body.name });
  if (exists) {
    res.status(400);
    throw new Error("Category already exists");
  }
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  Object.assign(category, req.body);
  const updated = await category.save();
  res.json({ success: true, data: updated });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  if (category.image?.public_id) await cloudinary.uploader.destroy(category.image.public_id);
  await category.deleteOne();
  res.json({ success: true, message: "Category removed" });
});

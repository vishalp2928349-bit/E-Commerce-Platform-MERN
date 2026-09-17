import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";

// Converts a multer memory buffer into a Cloudinary-uploadable data URI.
const bufferToDataUri = (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

// @desc    Upload one or more images to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("No files uploaded");
  }

  const uploads = await Promise.all(
    req.files.map((file) =>
      cloudinary.uploader.upload(bufferToDataUri(file), { folder: "mern-ecommerce" })
    )
  );

  const images = uploads.map((u) => ({ url: u.secure_url, public_id: u.public_id }));
  res.status(201).json({ success: true, data: images });
});

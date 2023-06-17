const express = require("express");
const router = express.Router();
const {
  createBrand,
  getBrandById,
  getAllBrands,
  getBrandByName,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandControllers");
const { protect } = require("../middlewares/authMiddleware");
const { requireStaff } = require("../middlewares/authorizeMiddleware");

// POST /api/brands
router.post("/create-brand", protect, requireStaff, createBrand);

// GET /api/brands/:brandId
router.get("/get-brand/:brandId", protect, getBrandById);

// GET /api/brands/get-brands
router.get("/get-brands", protect, getAllBrands);

// GET /api/brands?name=:name
router.get("/", protect, getBrandByName);

// PUT /api/brands/:brandId
router.put("/update-brand/:brandId", protect, requireStaff, updateBrand);

// DELETE /api/brands/:brandId
router.delete("/delete-brand/:brandId", protect, requireStaff, deleteBrand);

module.exports = router;

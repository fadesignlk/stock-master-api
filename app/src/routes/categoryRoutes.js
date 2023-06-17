const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategoryById,
  getAllCategories,
  getCategoryByName,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryControllers");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin,requireStaff, requireManager } = require("../middlewares/authorizeMiddleware");

// POST /api/categories
router.post("/create-category", protect, requireStaff, createCategory);

// GET /api/categories/:categoryId
router.get("/get-category/:categoryId", protect, getCategoryById);

// GET /api/categories/get-categories
router.get("/get-categories", protect, getAllCategories);

// GET /api/categories?name=:name
router.get("/", protect, getCategoryByName);

// PUT /api/categories/:categoryId
router.put("/update-category/:categoryId", protect, requireStaff, updateCategory);

// DELETE /api/categories/:categoryId
router.delete("/delete-category/:categoryId", protect, requireStaff, deleteCategory);

module.exports = router;

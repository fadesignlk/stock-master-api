const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");
const { protect } = require("../middlewares/authMiddleware");
const { requireStaff } = require("../middlewares/authorizeMiddleware");

// POST /api/products
router.post("/create-product", protect, requireStaff, createProduct);

// GET /api/products/:productId
router.get("/get-product/:productId", protect, getProductById);

// GET /api/products/get-products
router.get("/get-products", protect, getAllProducts);

// PUT /api/products/:productId
router.put("/update-product/:productId", protect, requireStaff, updateProduct);

// DELETE /api/products/:productId
router.delete("/delete-product/:productId", protect, requireStaff, deleteProduct);

module.exports = router;

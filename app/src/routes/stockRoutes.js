const express = require("express");
const router = express.Router();
const {
  createStock,
  getStockById,
  getAllStocks,
  updateStock,
  deleteStock,
} = require("../controllers/stockControllers");
const { protect } = require("../middlewares/authMiddleware");
const { requireStaff } = require("../middlewares/authorizeMiddleware");

// POST /api/stocks
router.post("/create-stock", protect, requireStaff, createStock);

// GET /api/stocks/:stockId
router.get("/get-stock/:stockId", protect, getStockById);

// GET /api/stocks/get-stocks
router.get("/get-stocks", protect, getAllStocks);

// PUT /api/stocks/:stockId
router.put("/update-stock/:stockId", protect, requireStaff, updateStock);

// DELETE /api/stocks/:stockId
router.delete("/delete-stock/:stockId", protect, requireStaff, deleteStock);

module.exports = router;

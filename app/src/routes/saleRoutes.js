const express = require("express");
const router = express.Router();
const {
  createSale,
  getSaleById,
  getAllSales,
  updateSale,
  deleteSale,
  addSaleItems,
  removeSaleItem,
  getSaleProducts,
  getSaleCustomer,
  updateSaleStatus,
  updateStockOnSaleCompletion
} = require("../controllers/saleControllers");
const { protect } = require("../middlewares/authMiddleware");
const { requireStaff, requireManager } = require("../middlewares/authorizeMiddleware");

// POST /api/sales
router.post("/create-sale", protect, requireStaff, createSale);

// GET /api/sales/:saleId
router.get("/get-sale/:saleId", protect, requireStaff, getSaleById);

// GET /api/sales/get-sales
router.get("/get-sales", protect, requireStaff, getAllSales);

// PUT /api/sales/update-sale/:saleId
router.put("/update-sale/:saleId", protect, requireStaff, updateSale);

// PUT /api/sales/update-sale-status/:saleId
router.put("/complete-sale/:saleId", protect, requireStaff, updateStockOnSaleCompletion);

// DELETE /api/sales/:saleId
router.delete("/delete-sale/:saleId", protect, requireManager, deleteSale);

// POST /api/sales/:saleId/add-items
router.post(
  "/:saleId/add-items",
  protect,
  requireStaff,
  addSaleItems
);

// DELETE /api/sales/:saleId/remove-item/:saleItemId
router.delete(
  "/:saleId/remove-item/:saleItemId",
  protect,
  requireStaff,
  removeSaleItem
);

// GET /api/sales/:saleId/products
router.get("/get-sale-products/:saleId", protect, requireStaff, getSaleProducts);

// GET /api/sales/:saleId/customer
router.get("/get-sale-customer/:saleId", protect, requireStaff, getSaleCustomer);

module.exports = router;

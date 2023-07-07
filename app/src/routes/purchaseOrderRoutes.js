const express = require("express");
const router = express.Router();
const {
  createPurchaseOrder,
  getPurchaseOrderById,
  getAllPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder,
  addPurchaseItems,
  removePurchaseItem,
  getPurchaseOrderProducts,
  getPurchaseOrderSupplier,
} = require("../controllers/purchaseOrderControllers");
const { protect } = require("../middlewares/authMiddleware");
const { requireStaff, requireManager } = require("../middlewares/authorizeMiddleware");

// POST /api/purchase-orders
router.post("/create-purchase-order", protect, requireStaff, createPurchaseOrder);

// GET /api/purchase-orders/:purchaseOrderId
router.get("/get-purchase-order/:purchaseOrderId", protect, requireStaff, getPurchaseOrderById);

// GET /api/purchase-orders/get-purchase-orders
router.get("/get-purchase-orders", protect, requireStaff, getAllPurchaseOrders);

// PUT /api/purchase-orders/:purchaseOrderId
router.put("/update-purchase-order/:purchaseOrderId", protect, requireManager, updatePurchaseOrder);

// DELETE /api/purchase-orders/:purchaseOrderId
router.delete("/delete-purchase-order/:purchaseOrderId", protect, requireManager, deletePurchaseOrder);

// POST /api/purchase-orders/:purchaseOrderId/add-items
router.post(
  "/:purchaseOrderId/add-items",
  protect,
  requireStaff,
  addPurchaseItems
);

// DELETE /api/purchase-orders/:purchaseOrderId/remove-item/:purchaseItemId
router.delete(
  "/:purchaseOrderId/remove-item/:purchaseItemId",
  protect,
  requireStaff,
  removePurchaseItem
);

// GET /api/purchase-orders/:purchaseOrderId/products
router.get("/get-purchase-order-products/:purchaseOrderId", protect, requireStaff, getPurchaseOrderProducts);

// GET /api/purchase-orders/:purchaseOrderId/supplier
router.get("/get-purchase-order-supplier/:purchaseOrderId", protect, requireStaff, getPurchaseOrderSupplier);

module.exports = router;

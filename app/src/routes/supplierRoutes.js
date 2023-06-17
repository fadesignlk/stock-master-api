const express = require("express");
const router = express.Router();
const {
  createSupplier,
  getSupplierById,
  getAllSuppliers,
  getSupplierByName,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierControllers");
const { protect } = require("../middlewares/authMiddleware");
const { requireStaff } = require("../middlewares/authorizeMiddleware");

// POST /api/suppliers
router.post("/create-supplier", protect, requireStaff, createSupplier);

// GET /api/suppliers/:supplierId
router.get("/get-supplier/:supplierId", protect, getSupplierById);

// GET /api/suppliers/get-suppliers
router.get("/get-suppliers", protect, getAllSuppliers);

// GET /api/suppliers?name=:name
router.get("/", protect, getSupplierByName);

// PUT /api/suppliers/:supplierId
router.put("/update-supplier/:supplierId", protect, requireStaff, updateSupplier);

// DELETE /api/suppliers/:supplierId
router.delete("/delete-supplier/:supplierId", protect, requireStaff, deleteSupplier);

module.exports = router;

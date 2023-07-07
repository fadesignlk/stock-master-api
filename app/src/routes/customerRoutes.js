const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerControllers");
const { protect } = require("../middlewares/authMiddleware");
const { requireStaff,requireManager } = require("../middlewares/authorizeMiddleware");

// POST /api/customers
router.post("/create-customer", protect, requireStaff, createCustomer);

// GET /api/customers/:customerId
router.get("/get-customer/:customerId", protect, getCustomerById);

// GET /api/customers/get-customers
router.get("/get-customers", protect, requireStaff, getAllCustomers);

// PUT /api/customers/:customerId
router.put("/update-customer/:customerId", protect, requireManager, updateCustomer);

// DELETE /api/customers/:customerId
router.delete("/delete-customer/:customerId", protect, requireManager, deleteCustomer);

module.exports = router;

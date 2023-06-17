const asyncHandler = require("express-async-handler");
const {
  getSupplierById,
  getAllSuppliers,
  createSupplier,
  getSupplierByName,
  updateSupplier,
  deleteSupplier,
} = require("../services/supplierServices");
const ApiError = require("../utils/ApiError");
const Supplier = require("../models/supplierModel");

// Controller for getting a supplier by ID
exports.getSupplierById = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  const supplier = await getSupplierById(supplierId);
  if (!supplier) throw new ApiError(400, "Supplier not found");

  res.json(supplier);
});

// Controller for getting all suppliers
exports.getAllSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await getAllSuppliers();
  res.json(suppliers);
});

// Controller for creating a new supplier
exports.createSupplier = asyncHandler(async (req, res) => {
  const { name, address, contact, email } = req.body;

  if (!name) {
    throw new ApiError(400, "Please provide a name for the supplier");
  }

  const supplierExists = await Supplier.findOne({ name });

  if (supplierExists) {
    throw new ApiError(400, "Supplier already exists");
  }

  const supplierData = {
    name,
    address,
    contact,
    email,
  };

  const newSupplier = await createSupplier(supplierData);
  res.json(newSupplier);
});

// Controller for getting a supplier by name
exports.getSupplierByName = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const supplier = await getSupplierByName(name);
  if (!supplier) throw new ApiError(400, "Supplier not found");

  res.json(supplier);
});

// Controller for updating a supplier
exports.updateSupplier = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  const supplierData = req.body;

  const updatedSupplier = await updateSupplier(supplierId, supplierData);
  if (!updatedSupplier) throw new ApiError(400, "Supplier not found");

  res.json(updatedSupplier);
});

// Controller for deleting a supplier
exports.deleteSupplier = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  const deletedSupplier = await deleteSupplier(supplierId);
  if (!deletedSupplier) throw new ApiError(400, "Supplier not found");

  res.json(deletedSupplier);
});

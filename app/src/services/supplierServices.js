const Supplier = require("../models/supplierModel");

/**
 * Get a supplier by ID.
 * @param {string} supplierId - The ID of the supplier to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved supplier.
 */
exports.getSupplierById = (supplierId) =>
  Supplier.findById(supplierId);

/**
 * Get all suppliers.
 * @returns {Promise} - A promise that resolves to an array of all suppliers.
 */
exports.getAllSuppliers = () =>
  Supplier.find();

/**
 * Create a new supplier.
 * @param {Object} supplierData - The data for the new supplier.
 * @returns {Promise} - A promise that resolves to the newly created supplier.
 */
exports.createSupplier = (supplierData) =>
  Supplier.create(supplierData);

/**
 * Get a supplier by name.
 * @param {string} name - The name of the supplier to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved supplier.
 */
exports.getSupplierByName = (name) =>
  Supplier.findOne({ name });

/**
 * Update a supplier.
 * @param {string} supplierId - The ID of the supplier to update.
 * @param {Object} supplierData - The updated data for the supplier.
 * @returns {Promise} - A promise that resolves to the updated supplier.
 */
exports.updateSupplier = (supplierId, supplierData) =>
  Supplier.findByIdAndUpdate(supplierId, supplierData, { new: true });

/**
 * Delete a supplier.
 * @param {string} supplierId - The ID of the supplier to delete.
 * @returns {Promise} - A promise that resolves to the deleted supplier.
 */
exports.deleteSupplier = (supplierId) =>
  Supplier.findByIdAndDelete(supplierId);

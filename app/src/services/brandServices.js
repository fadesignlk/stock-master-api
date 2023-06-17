const Brand = require("../models/brandModel");

/**
 * Get a brand by ID.
 * @param {string} brandId - The ID of the brand to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved brand.
 */
exports.getBrandById = (brandId) =>
  Brand.findById(brandId);

/**
 * Get all brands.
 * @returns {Promise} - A promise that resolves to an array of all brands.
 */
exports.getAllBrands = () =>
  Brand.find();

/**
 * Create a new brand.
 * @param {Object} brandData - The data for the new brand.
 * @returns {Promise} - A promise that resolves to the newly created brand.
 */
exports.createBrand = (brandData) =>
  Brand.create(brandData);

/**
 * Get a brand by name.
 * @param {string} name - The name of the brand to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved brand.
 */
exports.getBrandByName = (name) =>
  Brand.findOne({ name });

/**
 * Update a brand.
 * @param {string} brandId - The ID of the brand to update.
 * @param {Object} brandData - The updated data for the brand.
 * @returns {Promise} - A promise that resolves to the updated brand.
 */
exports.updateBrand = (brandId, brandData) =>
  Brand.findByIdAndUpdate(brandId, brandData, { new: true });

/**
 * Delete a brand.
 * @param {string} brandId - The ID of the brand to delete.
 * @returns {Promise} - A promise that resolves to the deleted brand.
 */
exports.deleteBrand = (brandId) =>
  Brand.findByIdAndDelete(brandId);

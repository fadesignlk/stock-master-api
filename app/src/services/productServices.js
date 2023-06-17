const Product = require("../models/productModel");

/**
 * Get a product by ID.
 * @param {string} productId - The ID of the product to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved product.
 */
exports.getProductById = (productId) =>
  Product.findById(productId).populate({ path: 'brand', select: '-__v -createdAt -updatedAt' }).populate({ path: 'category', select: ' -__v -createdAt -updatedAt' });

/**
 * Get all products.
 * @returns {Promise} - A promise that resolves to an array of all products.
 */
exports.getAllProducts = () =>
  Product.find()
    .populate({ path: 'brand', select: '-__v -createdAt -updatedAt' })
    .populate({ path: 'category', select: '-__v -createdAt -updatedAt' });

/**
 * Create a new product.
 * @param {Object} productData - The data for the new product.
 * @returns {Promise} - A promise that resolves to the newly created product.
 */
exports.createProduct = (productData) => Product.create(productData);

/**
 * Update a product.
 * @param {string} productId - The ID of the product to update.
 * @param {Object} productData - The updated data for the product.
 * @returns {Promise} - A promise that resolves to the updated product.
 */
exports.updateProduct = (productId, productData) =>
  Product.findByIdAndUpdate(productId, productData, { new: true });

/**
 * Delete a product.
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise} - A promise that resolves to the deleted product.
 */
exports.deleteProduct = (productId) => Product.findByIdAndDelete(productId);
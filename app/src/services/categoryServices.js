const Category = require("../models/categoryModel");

/**
 * Get a category by ID.
 * @param {string} categoryId - The ID of the category to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved category.
 */
exports.getCategoryById = (categoryId) =>
  Category.findById(categoryId);

/**
 * Get all categories.
 * @returns {Promise} - A promise that resolves to an array of all categories.
 */
exports.getAllCategories = () =>
  Category.find();

/**
 * Create a new category.
 * @param {Object} categoryData - The data for the new category.
 * @returns {Promise} - A promise that resolves to the newly created category.
 */
exports.createCategory = (categoryData) =>
  Category.create(categoryData);

/**
 * Get a category by name.
 * @param {string} name - The name of the category to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved category.
 */
exports.getCategoryByName = (name) =>
  Category.findOne({ name });

/**
 * Update a category.
 * @param {string} categoryId - The ID of the category to update.
 * @param {Object} categoryData - The updated data for the category.
 * @returns {Promise} - A promise that resolves to the updated category.
 */
exports.updateCategory = (categoryId, categoryData) =>
  Category.findByIdAndUpdate(categoryId, categoryData, { new: true });

/**
 * Delete a category.
 * @param {string} categoryId - The ID of the category to delete.
 * @returns {Promise} - A promise that resolves to the deleted category.
 */
exports.deleteCategory = (categoryId) =>
  Category.findByIdAndDelete(categoryId);

const asyncHandler = require("express-async-handler");
const {
  getCategoryById,
  getAllCategories,
  createCategory,
  getCategoryByName,
  updateCategory,
  deleteCategory,
} = require("../services/categoryServices");
const ApiError = require("../utils/ApiError");
const Category = require("../models/categoryModel");

// Controller for getting a category by ID
exports.getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await getCategoryById(categoryId);
  if (!category) throw new ApiError(400, "Category not found");

  res.json(category);
});

// Controller for getting all categories
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await getAllCategories();
  res.json(categories);
});

// Controller for creating a new category
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Please provide name and description for the category");
  }

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    throw new ApiError(400, "Category already exists");
  }

  const categoryData = {
    name,
    description,
  };

  const newCategory = await createCategory(categoryData);
  res.json(newCategory);
});

// Controller for getting a category by name
exports.getCategoryByName = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const category = await getCategoryByName(name);
  if (!category) throw new ApiError(400, "Category not found");

  res.json(category);
});

// Controller for updating a category
exports.updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const categoryData = req.body;

  const updatedCategory = await updateCategory(categoryId, categoryData);
  if (!updatedCategory) throw new ApiError(400, "Category not found");

  res.json(updatedCategory);
});

// Controller for deleting a category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const deletedCategory = await deleteCategory(categoryId);
  if (!deletedCategory) throw new ApiError(400, "Category not found");

  res.json(deletedCategory);
});

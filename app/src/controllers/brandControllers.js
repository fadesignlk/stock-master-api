const asyncHandler = require("express-async-handler");
const {
  getBrandById,
  getAllBrands,
  createBrand,
  getBrandByName,
  updateBrand,
  deleteBrand,
} = require("../services/brandServices");
const ApiError = require("../utils/ApiError");
const Brand = require("../models/brandModel");

// Controller for getting a brand by ID
exports.getBrandById = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const brand = await getBrandById(brandId);
  if (!brand) throw new ApiError(400, "Brand not found");

  res.json(brand);
});

// Controller for getting all brands
exports.getAllBrands = asyncHandler(async (req, res) => {
  const brands = await getAllBrands();
  res.json(brands);
});

// Controller for creating a new brand
exports.createBrand = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Please provide a name for the brand");
  }

  const brandExists = await Brand.findOne({ name });

  if (brandExists) {
    throw new ApiError(400, "Brand already exists");
  }

  const brandData = {
    name,
    description,
  };

  const newBrand = await createBrand(brandData);
  res.json(newBrand);
});

// Controller for getting a brand by name
exports.getBrandByName = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const brand = await getBrandByName(name);
  if (!brand) throw new ApiError(400, "Brand not found");

  res.json(brand);
});

// Controller for updating a brand
exports.updateBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const brandData = req.body;

  const updatedBrand = await updateBrand(brandId, brandData);
  if (!updatedBrand) throw new ApiError(400, "Brand not found");

  res.json(updatedBrand);
});

// Controller for deleting a brand
exports.deleteBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const deletedBrand = await deleteBrand(brandId);
  if (!deletedBrand) throw new ApiError(400, "Brand not found");

  res.json(deletedBrand);
});

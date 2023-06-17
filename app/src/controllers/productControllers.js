const asyncHandler = require("express-async-handler");
const {
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../services/productServices");
const ApiError = require("../utils/ApiError");
const Product = require("../models/productModel");

// Controller for getting a product by ID
exports.getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await getProductById(productId);
  if (!product) throw new ApiError(400, "Product not found");

  res.json(product);
});

// Controller for getting all products
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await getAllProducts();
  res.json(products);
});

// Controller for creating a new product
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, brand, description, purchPrice, sellingPrice, sku, category, image } = req.body;

  if (!name || !brand) {
    throw new ApiError(400, "Please provide a name and brand for the product");
  }

  const productData = {
    name,
    brand,
    description,
    purchPrice,
    sellingPrice,
    sku,
    category,
    image,
  };

  const newProduct = await createProduct(productData);
  res.json(newProduct);
});

// Controller for updating a product
exports.updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const productData = req.body;

  const updatedProduct = await updateProduct(productId, productData);
  if (!updatedProduct) throw new ApiError(400, "Product not found");

  res.json(updatedProduct);
});

// Controller for deleting a product
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const deletedProduct = await deleteProduct(productId);
  if (!deletedProduct) throw new ApiError(400, "Product not found");

  res.json(deletedProduct);
});

const asyncHandler = require("express-async-handler");
const {
  getStockById,
  getAllStocks,
  createStock,
  updateStock,
  deleteStock,
} = require("../services/stockServices");
const ApiError = require("../utils/ApiError");
const Stock = require("../models/stockModel");

// Controller for getting a stock by ID
exports.getStockById = asyncHandler(async (req, res) => {
  const { stockId } = req.params;
  const stock = await getStockById(stockId);
  if (!stock) throw new ApiError(400, "Stock not found");

  res.json(stock);
});

// Controller for getting all stocks
exports.getAllStocks = asyncHandler(async (req, res) => {
  const stocks = await getAllStocks();
  res.json(stocks);
});

// Controller for creating a new stock
exports.createStock = asyncHandler(async (req, res) => {
  const { product, supplier, quantity, location, description } = req.body;

  if (!product || !supplier || !quantity) {
    throw new ApiError(400, "Please provide product, supplier, and quantity for the stock");
  }

  const stockData = {
    product,
    supplier,
    quantity,
    location,
    description,
  };

  const newStock = await createStock(stockData);
  res.json(newStock);
});

// Controller for updating a stock
exports.updateStock = asyncHandler(async (req, res) => {
  const { stockId } = req.params;
  const stockData = req.body;

  const updatedStock = await updateStock(stockId, stockData);
  if (!updatedStock) throw new ApiError(400, "Stock not found");

  res.json(updatedStock);
});

// Controller for deleting a stock
exports.deleteStock = asyncHandler(async (req, res) => {
  const { stockId } = req.params;
  const deletedStock = await deleteStock(stockId);
  if (!deletedStock) throw new ApiError(400, "Stock not found");

  res.json(deletedStock);
});

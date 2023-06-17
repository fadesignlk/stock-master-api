const Stock = require("../models/stockModel");

/**
 * Get a stock by ID.
 * @param {string} stockId - The ID of the stock to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved stock.
 */
exports.getStockById = (stockId) =>
  Stock.findById(stockId);

/**
 * Get all stocks.
 * @returns {Promise} - A promise that resolves to an array of all stocks.
 */
exports.getAllStocks = () =>
  Stock.find();

/**
 * Create a new stock.
 * @param {Object} stockData - The data for the new stock.
 * @returns {Promise} - A promise that resolves to the newly created stock.
 */
exports.createStock = (stockData) =>
  Stock.create(stockData);

/**
 * Update a stock.
 * @param {string} stockId - The ID of the stock to update.
 * @param {Object} stockData - The updated data for the stock.
 * @returns {Promise} - A promise that resolves to the updated stock.
 */
exports.updateStock = (stockId, stockData) =>
  Stock.findByIdAndUpdate(stockId, stockData, { new: true });

/**
 * Delete a stock.
 * @param {string} stockId - The ID of the stock to delete.
 * @returns {Promise} - A promise that resolves to the deleted stock.
 */
exports.deleteStock = (stockId) =>
  Stock.findByIdAndDelete(stockId);

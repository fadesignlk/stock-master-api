const Sale = require("../models/saleModel");
const Customer = require("../models/customerModel");
const Product = require("../models/productModel");
const Stock = require("../models/stockModel");
const ApiError = require("../utils/ApiError");


/**
 * Get a sale by ID.
 * @param {string} saleId - The ID of the sale to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved sale.
 */
exports.getSaleById = (saleId) =>
  Sale.findById(saleId)
    .populate("customer", "-__v -createdAt -updatedAt")
    .populate({
      path: "items.stock",
      select: "-__v -createdAt -updatedAt",
      populate: { path: "product", select: "-__v -createdAt -updatedAt" }
    }).populate({
      path: "items.stock",
      select: "-__v -createdAt -updatedAt",
      populate: { path: "supplier", select: "-__v -createdAt -updatedAt" },
    }).populate({
      path: "items.stock",
      select: "-__v -createdAt -updatedAt",
      populate: { path: "location", select: "-__v -createdAt -updatedAt" }
    });

/**
 * Get all sales.
 * @returns {Promise} - A promise that resolves to an array of all sales.
 */
exports.getAllSales = () =>
  Sale.find()
    .populate("customer", "-__v -createdAt -updatedAt")
    .populate({
      path: "items.stock",
      select: "-__v -createdAt -updatedAt",
      populate: { path: "product", select: "-__v -createdAt -updatedAt" },
    }).populate({
      path: "items.stock",
      select: "-__v -createdAt -updatedAt",
      populate: { path: "supplier", select: "-__v -createdAt -updatedAt" },
    }).populate({
      path: "items.stock",
      select: "-__v -createdAt -updatedAt",
      populate: { path: "location", select: "-__v -createdAt -updatedAt" }
    });

/**
 * Create a new sale.
 * @param {Object} saleData - The data for the new sale.
 * @returns {Promise} - A promise that resolves to the newly created sale.
 */
exports.createSale = (saleData) =>
  Sale.create(saleData);

/**
 * Update a sale.
 * @param {string} saleId - The ID of the sale to update.
 * @param {Object} saleData - The updated data for the sale.
 * @returns {Promise} - A promise that resolves to the updated sale.
 */
exports.updateSale = (saleId, saleData) =>
  Sale.findByIdAndUpdate(
    saleId,
    saleData,
    { new: true }
  );

/**
 * Delete a sale.
 * @param {string} saleId - The ID of the sale to delete.
 * @returns {Promise} - A promise that resolves to the deleted sale.
 */
exports.deleteSale = (saleId) =>
  Sale.findByIdAndDelete(saleId);

/**
 * Add sale items to a sale.
 * @param {string} saleId - The ID of the sale.
 * @param {Array} saleItems - An array of sale items to add.
 * @returns {Promise} - A promise that resolves to the updated sale.
 */
exports.addSaleItems = async (saleId, saleItems) => {
  const sale = await Sale.findById(saleId);
  if (!sale) {
    throw new ApiError(400, "Sale not found");
  }

  // Check if the sale is in a valid state to add items
  const validStates = ["pending", "partly-paid"];
  if (!validStates.includes(sale.status)) {
    throw new ApiError(400, "Cannot add sale items to the sale in its current state");
  }

  // Add the sale items to the sale
  sale.items.push(...saleItems);
  let totalAmount = 0;

  for (const item of sale.items) {
    const stock = await Stock.findById(item.stock).populate("product");
    if (stock && stock.product) {
      totalAmount += Number(item.quantity * stock.product.sellingPrice);
    }
  }
 
  totalAmount -= Number(sale.discount || 0);

  // Update the total amount
  sale.totalAmount = totalAmount;

  // Save the updated sale
  await sale.save();

  return sale;
};

/**
 * Remove a sale item from a sale.
 * @param {string} saleId - The ID of the sale.
 * @param {string} saleItemId - The ID of the sale item to remove.
 * @returns {Promise} - A promise that resolves to the updated sale.
 */
exports.removeSaleItem = async (saleId, saleItemId) => {
  const sale = await Sale.findById(saleId);
  if (!sale) {
    throw new ApiError(400, "Sale not found");
  }

  // Check if the sale is in a valid state to remove items
  const validStates = ["pending", "completed", "delivered", "partly-paid"];
  if (!validStates.includes(sale.status)) {
    throw new ApiError(400, "Cannot remove sale items from the sale in its current state");
  }

  // Find the index of the sale item
  const saleItemIndex = sale.items.findIndex(
    (item) => item._id.toString() === saleItemId
  );

  if (saleItemIndex === -1) {
    throw new ApiError(400, "Sale item not found");
  }

  // Remove the sale item from the array
  sale.items.splice(saleItemIndex, 1);

  let totalAmount = 0;

  for (const item of sale.items) {
    const stock = await Stock.findById(item.stock).populate("product");
    if (stock && stock.product) {
      totalAmount += Number(item.quantity * stock.product.sellingPrice);
    }
  }
 
  totalAmount -= Number(sale.discount || 0);

  // Update the total amount
  sale.totalAmount = totalAmount;

  // Save the updated sale
  await sale.save();

  return sale;
};

/**
 * Get the products associated with a sale.
 * @param {string} saleId - The ID of the sale.
 * @returns {Promise} - A promise that resolves to an array of products.
 */
exports.getSaleProducts = async (saleId) => {
  const sale = await Sale.findById(saleId).populate("customer", "-__v -createdAt -updatedAt")
    .populate({
      path: "items.stock",
      select: "-__v -createdAt -updatedAt",
      populate: { path: "product", select: "-__v -createdAt -updatedAt" }
    });

  if (!sale) {
    throw new Error("Sale not found");
  }
  const productIds = sale.items.map((item) => item.stock.product);
  
  return Product.find({ _id: { $in: productIds } }).select(
    "-__v -createdAt -updatedAt"
  );
};

/**
 * Get the customer associated with a sale.
 * @param {string} saleId - The ID of the sale.
 * @returns {Promise} - A promise that resolves to the customer.
 */
exports.getSaleCustomer = async (saleId) => {
  const sale = await Sale.findById(saleId);
  if (!sale) {
    throw new Error("Sale not found");
  }
  return Customer.findById(sale.customer).select(
    "-__v -createdAt -updatedAt"
  );
};

/**
 * Update the stock when a sale is completed.
 * @param {string} saleId - The ID of the completed sale.
 * @returns {Promise} - A promise that resolves to the updated stock.
 */
exports.updateStockOnSaleCompletion = async (saleId, balance = null) => {
  const sale = await Sale.findById(saleId);
  if (!sale) {
    throw new ApiError(400, "Sale not found");
  }

  const validStates = ["partly-paid", "pending"];
  if (!validStates.includes(sale.status)) {
    throw new ApiError(400, "Cannot update stock from the sales in its current state");
  }

  const stockUpdates = [];

  if (balance > 0) {
    throw new ApiError(400, `Cannot complete the sale, ${balance} balance left to be paid`);
  }

  // Update the stock quantities for each sale item
  for (const item of sale.items) {
    const stockId = item.stock;
    const quantitySold = item.quantity;

    const stock = await Stock.findById(stockId);
    if (!stock) {
      throw new ApiError(400, "Stock not found");
    }

    // Check if the stock has sufficient quantity
    if (stock.quantity < quantitySold) {
      throw new ApiError(400, "Insufficient stock quantity");
    }

    // Update the stock quantity
    stock.quantity -= quantitySold;

    stockUpdates.push(stock.save());
  }

  // Wait for all stock updates to complete
  await Promise.all(stockUpdates);

  return stockUpdates;
};

/**
 * Calculate the total amount of a sale.
 * @param {Object} sale - The sale object.
 * @returns {Number} - The total amount.
 */
async function calculateTotalAmount(sale) {
  let totalAmount = 0;
  for (const item of sale.items) {
    const stock = await Stock.findById(item.stock).populate("product");
    if (stock && stock.product) {
      totalAmount += Number(item.quantity * stock.product.sellingPrice);
    }
  }
 
  return totalAmount - Number(sale.discount || 0);
}
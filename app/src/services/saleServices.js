const Sale = require("../models/saleModel");
const Customer = require("../models/customerModel");
const Product = require("../models/productModel");
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
      path: "products.product",
      select: "-__v -createdAt -updatedAt",
    });

/**
 * Get all sales.
 * @returns {Promise} - A promise that resolves to an array of all sales.
 */
exports.getAllSales = () =>
  Sale.find()
    .populate("customer", "-__v -createdAt -updatedAt")
    .populate({
      path: "products.product",
      select: "-__v -createdAt -updatedAt",
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
  const validStates = ["draft", "completed"];
  if (!validStates.includes(sale.status)) {
    throw new ApiError(400, "Cannot add sale items to the sale in its current state");
  }

  // Retrieve the products for the sale items
  const productIds = saleItems.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  if (products.length !== productIds.length) {
    throw new ApiError(400, "One or more products not found");
  }

  // Add the sale items to the sale
  sale.products.push(...saleItems);

  // Update the total amount
  const itemTotal = saleItems.reduce((total, item) => {
    const product = products.find((p) => p._id.toString() === item.product.toString());
    return total + item.quantity * product.sellingPrice;
  }, 0);
  sale.totalAmount += itemTotal;

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
  const validStates = ["pending", "partially-paid"];
  if (!validStates.includes(sale.status)) {
    throw new ApiError(400, "Cannot remove sale items from the sale in its current state");
  }

  // Find the index of the sale item
  const saleItemIndex = sale.products.findIndex(
    (item) => item._id.toString() === saleItemId
  );

  if (saleItemIndex === -1) {
    throw new ApiError(400, "Sale item not found");
  }

  // Retrieve the sale item being removed
  const saleItem = sale.products[saleItemIndex];

  // Retrieve the product details
  const product = await Product.findById(saleItem.product);
  if (!product) {
    throw new ApiError(400, "Product not found");
  }

  // Update the total amount
  sale.totalAmount -= saleItem.quantity * product.sellingPrice;

  // Remove the sale item from the array
  sale.products.splice(saleItemIndex, 1);

  // Update the sale status based on the payment
  sale.status = sale.payment === sale.totalAmount ? "completed" : "partially-paid";

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
  const sale = await Sale.findById(saleId);
  if (!sale) {
    throw new Error("Sale not found");
  }
  const productIds = sale.products.map(
    (item) => item.product.toString()
  );
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

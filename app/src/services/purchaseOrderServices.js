const PurchaseOrder = require("../models/purchaseOrderModel");
const Product = require("../models/productModel");
const Supplier = require("../models/supplierModel");

/**
 * Get a purchase order by ID.
 * @param {string} purchaseOrderId - The ID of the purchase order to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved purchase order.
 */
exports.getPurchaseOrderById = (purchaseOrderId) =>
  PurchaseOrder.findById(purchaseOrderId)
    .populate("supplier", "-__v -createdAt -updatedAt")
    .populate({
      path: "products.product",
      select: "-__v -createdAt -updatedAt",
    });

/**
 * Get all purchase orders.
 * @returns {Promise} - A promise that resolves to an array of all purchase orders.
 */
exports.getAllPurchaseOrders = () =>
  PurchaseOrder.find()
    .populate("supplier", "-__v -createdAt -updatedAt")
    .populate({
      path: "products.product",
      select: "-__v -createdAt -updatedAt",
    });

/**
 * Create a new purchase order.
 * @param {Object} purchaseOrderData - The data for the new purchase order.
 * @returns {Promise} - A promise that resolves to the newly created purchase order.
 */
exports.createPurchaseOrder = (purchaseOrderData) =>
  PurchaseOrder.create(purchaseOrderData);

/**
 * Update a purchase order.
 * @param {string} purchaseOrderId - The ID of the purchase order to update.
 * @param {Object} purchaseOrderData - The updated data for the purchase order.
 * @returns {Promise} - A promise that resolves to the updated purchase order.
 */
exports.updatePurchaseOrder = (purchaseOrderId, purchaseOrderData) =>
  PurchaseOrder.findByIdAndUpdate(
    purchaseOrderId,
    purchaseOrderData,
    { new: true }
  );

/**
 * Delete a purchase order.
 * @param {string} purchaseOrderId - The ID of the purchase order to delete.
 * @returns {Promise} - A promise that resolves to the deleted purchase order.
 */
exports.deletePurchaseOrder = (purchaseOrderId) =>
  PurchaseOrder.findByIdAndDelete(purchaseOrderId);

/**
 * Add purchase items to a purchase order.
 * @param {string} purchaseOrderId - The ID of the purchase order.
 * @param {Array} purchaseItems - An array of purchase items to add.
 * @returns {Promise} - A promise that resolves to the updated purchase order.
 */
exports.addPurchaseItems = async (purchaseOrderId, purchaseItems) => {
  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
  if (!purchaseOrder) {
    throw new ApiError(400, "Purchase order not found");
  }

  // Check if the purchase order is in a valid state to add items
  const validStates = ["draft", "approved"];
  if (!validStates.includes(purchaseOrder.status)) {
    throw new ApiError(400, "Cannot add purchase items to the purchase order in its current state");
  }

  // Retrieve the products for the purchase items
  const productIds = purchaseItems.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  if (products.length !== productIds.length) {
    throw new ApiError(400, "One or more products not found");
  }

  // Add the purchase items to the purchase order
  purchaseOrder.products.push(...purchaseItems);

  // Save the updated purchase order
  await purchaseOrder.save();

  return purchaseOrder;
};

/**
 * Remove a purchase order item from a purchase order.
 * @param {string} purchaseOrderId - The ID of the purchase order.
 * @param {string} purchaseItemId - The ID of the purchase order item to remove.
 * @returns {Promise} - A promise that resolves to the updated purchase order.
 */
exports.removePurchaseItem = async (purchaseOrderId, purchaseItemId) => {
  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
  if (!purchaseOrder) {
    throw new ApiError(400, "Purchase order not found");
  }

  // Check if the purchase order is in a valid state to remove items
  const validStates = ["draft", "approved"];
  if (!validStates.includes(purchaseOrder.status)) {
    throw new ApiError(400, "Cannot remove purchase items from the purchase order in its current state");
  }

  // Find the index of the purchase item
  const purchaseItemIndex = purchaseOrder.products.findIndex(
    (item) => item._id.toString() === purchaseItemId
  );

  if (purchaseItemIndex === -1) {
    throw new ApiError(400, "Purchase order item not found");
  }

  // Remove the purchase item from the array
  purchaseOrder.products.splice(purchaseItemIndex, 1);

  // Save the updated purchase order
  await purchaseOrder.save();

  return purchaseOrder;
};

/**
 * Get the products associated with a purchase order.
 * @param {string} purchaseOrderId - The ID of the purchase order.
 * @returns {Promise} - A promise that resolves to an array of products.
 */
exports.getPurchaseOrderProducts = async (purchaseOrderId) => {
  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
  if (!purchaseOrder) {
    throw new Error("Purchase order not found");
  }
  const productIds = purchaseOrder.products.map(
    (item) => item.product.toString()
  );
  return Product.find({ _id: { $in: productIds } }).select(
    "-__v -createdAt -updatedAt"
  );
};

/**
 * Get the supplier associated with a purchase order.
 * @param {string} purchaseOrderId - The ID of the purchase order.
 * @returns {Promise} - A promise that resolves to the supplier.
 */
exports.getPurchaseOrderSupplier = async (purchaseOrderId) => {
  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
  if (!purchaseOrder) {
    throw new Error("Purchase order not found");
  }
  return Supplier.findById(purchaseOrder.supplier).select(
    "-__v -createdAt -updatedAt"
  );
};

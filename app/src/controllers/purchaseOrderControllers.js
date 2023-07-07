const asyncHandler = require("express-async-handler");
const {
  getPurchaseOrderById,
  getAllPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  addPurchaseItems,
  removePurchaseItem,
  getPurchaseOrderProducts,
  getPurchaseOrderSupplier,
} = require("../services/purchaseOrderServices");
const ApiError = require("../utils/ApiError");

// Controller for getting a purchase order by ID
exports.getPurchaseOrderById = asyncHandler(async (req, res) => {
  const { purchaseOrderId } = req.params;
  const purchaseOrder = await getPurchaseOrderById(purchaseOrderId);
  if (!purchaseOrder) throw new ApiError(400, "Purchase order not found");

  res.json(purchaseOrder);
});

// Controller for getting all purchase orders
exports.getAllPurchaseOrders = asyncHandler(async (req, res) => {
  const purchaseOrders = await getAllPurchaseOrders();
  res.json(purchaseOrders);
});

// Controller for creating a new purchase order
exports.createPurchaseOrder = asyncHandler(async (req, res) => {
  const { supplier, products, status, expectedDeliveryDate, receivedDate } = req.body;

  if (!supplier || !products || products.length === 0) {
    throw new ApiError(400, "Please provide a supplier and at least one product for the purchase order");
  }

  const purchaseOrderData = {
    supplier,
    products,
    status,
    expectedDeliveryDate,
    receivedDate,
  };

  const newPurchaseOrder = await createPurchaseOrder(purchaseOrderData);
  res.json(newPurchaseOrder);
});

// Controller for updating a purchase order
exports.updatePurchaseOrder = asyncHandler(async (req, res) => {
  const { purchaseOrderId } = req.params;
  const purchaseOrderData = req.body;

  const updatedPurchaseOrder = await updatePurchaseOrder(purchaseOrderId, purchaseOrderData);
  if (!updatedPurchaseOrder) throw new ApiError(400, "Purchase order not found");

  res.json(updatedPurchaseOrder);
});

// Controller for deleting a purchase order
exports.deletePurchaseOrder = asyncHandler(async (req, res) => {
  const { purchaseOrderId } = req.params;
  const deletedPurchaseOrder = await deletePurchaseOrder(purchaseOrderId);
  if (!deletedPurchaseOrder) throw new ApiError(400, "Purchase order not found");

  res.json(deletedPurchaseOrder);
});

// Controller for adding purchase items to a purchase order
exports.addPurchaseItems = asyncHandler(async (req, res) => {
  const { purchaseOrderId } = req.params;
  const { purchaseItems } = req.body;

  if (!purchaseItems || purchaseItems.length === 0) {
    throw new ApiError(400, "Please provide at least one purchase item");
  }

  const updatedPurchaseOrder = await addPurchaseItems(
    purchaseOrderId,
    purchaseItems
  );

  res.json(updatedPurchaseOrder);
});

// Controller for removing a purchase order item from a purchase order
exports.removePurchaseItem = asyncHandler(async (req, res) => {
  const { purchaseOrderId, purchaseItemId } = req.params;

  const updatedPurchaseOrder = await removePurchaseItem(
    purchaseOrderId,
    purchaseItemId
  );

  res.json(updatedPurchaseOrder);
});

// Controller for getting the products associated with a purchase order
exports.getPurchaseOrderProducts = asyncHandler(async (req, res) => {
  const { purchaseOrderId } = req.params;
  const products = await getPurchaseOrderProducts(purchaseOrderId);
  res.json(products);
});

// Controller for getting the supplier associated with a purchase order
exports.getPurchaseOrderSupplier = asyncHandler(async (req, res) => {
  const { purchaseOrderId } = req.params;
  const supplier = await getPurchaseOrderSupplier(purchaseOrderId);
  res.json(supplier);
});

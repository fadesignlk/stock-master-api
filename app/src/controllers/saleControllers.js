const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");

const {
  getSaleById,
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
  addSaleItems,
  removeSaleItem,
  getSaleProducts,
  getSaleCustomer,
} = require("../services/saleServices");

// Controller for getting a sale by ID
exports.getSaleById = asyncHandler(async (req, res) => {
  const { saleId } = req.params;
  const sale = await getSaleById(saleId);
  if (!sale) throw new ApiError(400, "Sale not found");

  res.json(sale);
});

// Controller for getting all sales
exports.getAllSales = asyncHandler(async (req, res) => {
  const sales = await getAllSales();
  res.json(sales);
});

// Controller for creating a new sale
exports.createSale = asyncHandler(async (req, res) => {
  const { customer, products, discount, saleDate, payment } = req.body;

  if (!customer || !products || products.length === 0) {
    throw new ApiError(400, "Please provide a customer and at least one product for the sale");
  }

  // Calculate the total amount
  let totalAmount = 0;
  for (const product of products) {
    const { sellingPrice, quantity } = product;
    totalAmount += sellingPrice * quantity;
  }

  // Deduct the discount amount from the total amount
  const discountedAmount = totalAmount - discount;

  const saleData = {
    customer,
    products,
    totalAmount: discountedAmount,
    discount,
    payment,
    saleDate,
    status: payment === discountedAmount ? "completed" : payment < discountedAmount ? "partially-paid" : "pending",
  };

  const newSale = await createSale(saleData);
  res.json(newSale);
});

// Controller for updating a sale
exports.updateSale = asyncHandler(async (req, res) => {
  const { saleId } = req.params;
  const { customer, products, discount, saleDate, payment, status } = req.body;

  // Calculate the total amount
  let totalAmount = 0;
  for (const product of products) {
    const { sellingPrice, quantity } = product;
    totalAmount += sellingPrice * quantity;
  }

  const saleData = {
    customer,
    products,
    discount,
    payment,
    saleDate,
    status: payment === totalAmount ? "completed" : payment < totalAmount ? "partially-paid" : status,
  };

  // Deduct the discount amount from the total amount
  const discountedAmount = totalAmount - discount;
  saleData.totalAmount = discountedAmount;

  const updatedSale = await updateSale(saleId, saleData);
  if (!updatedSale) throw new ApiError(400, "Sale not found");

  res.json(updatedSale);
});

// Controller for deleting a sale
exports.deleteSale = asyncHandler(async (req, res) => {
  const { saleId } = req.params;
  const deletedSale = await deleteSale(saleId);
  if (!deletedSale) throw new ApiError(400, "Sale not found");

  res.json(deletedSale);
});

// Controller for adding sale items to a sale
exports.addSaleItems = asyncHandler(async (req, res) => {
  const { saleId } = req.params;
  const { saleItems } = req.body;

  if (!saleItems || saleItems.length === 0) {
    throw new ApiError(400, "Please provide at least one sale item");
  }

  const updatedSale = await addSaleItems(saleId, saleItems);

  // Recalculate the total amount
  const totalAmount = updatedSale.products.reduce((total, item) => {
    const { sellingPrice, quantity } = item;
    return total + sellingPrice * quantity;
  }, 0);

  // Update the sale's totalAmount and status based on the payment
  updatedSale.totalAmount = totalAmount;
  updatedSale.status = updatedSale.payment === totalAmount ? "completed" : "partially-paid";

  // Save the updated sale
  await updatedSale.save();

  res.json(updatedSale);
});

// Controller for removing a sale item from a sale
exports.removeSaleItem = asyncHandler(async (req, res) => {
  const { saleId, saleItemId } = req.params;

  const updatedSale = await removeSaleItem(saleId, saleItemId);

  // Recalculate the total amount
  const totalAmount = updatedSale.products.reduce((total, item) => {
    const { sellingPrice, quantity } = item;
    return total + sellingPrice * quantity;
  }, 0);

  // Update the sale's totalAmount and status based on the payment
  updatedSale.totalAmount = totalAmount;
  updatedSale.status = updatedSale.payment === totalAmount ? "completed" : "partially-paid";

  // Save the updated sale
  await updatedSale.save();

  res.json(updatedSale);
});

// Controller for getting the products associated with a sale
exports.getSaleProducts = asyncHandler(async (req, res) => {
  const { saleId } = req.params;
  const products = await getSaleProducts(saleId);
  res.json(products);
});

// Controller for getting the customer associated with a sale
exports.getSaleCustomer = asyncHandler(async (req, res) => {
  const { saleId } = req.params;
  const customer = await getSaleCustomer(saleId);
  res.json(customer);
});

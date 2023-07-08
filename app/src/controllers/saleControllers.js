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
  updateStockOnSaleCompletion
} = require("../services/saleServices");

const {
  getProductById
} = require("../services/productServices");

const {
  getStockById
} = require("../services/stockServices");

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
  const { customer, items, discount, payment, saleDate, status } = req.body;

  if (!customer || !items || items.length === 0) {
    throw new ApiError(400, "Please provide a customer and at least one item for the sale");
  }

  // Calculate the total amount
  let totalAmount = 0;
  for (const item of items) {
    const { stock, quantity } = item;
    const stockExist = await getStockById(stock);

    if (stockExist.status !== "in-stock" || stockExist.quantity < quantity) {
      throw new ApiError(400, "Item out of stock");
    }

    const product = await getProductById(stockExist.product);
    totalAmount += product.sellingPrice * quantity;
  }
  // Deduct the discount amount from the total amount
  const discountedAmount = totalAmount - discount;

  const saleData = {
    customer,
    items,
    totalAmount: discountedAmount,
    discount,
    payment,
    saleDate,
    status: payment === discountedAmount ? "completed" : payment < discountedAmount ? "partly-paid" : status,
  };

  const newSale = await createSale(saleData);
  res.json(newSale);
});

// Controller for updating a sale
exports.updateSale = asyncHandler(async (req, res) => {
  const { saleId } = req.params;
  const { customer, products, discount, saleDate, payment, status } = req.body;

  const sale = await getSaleById(saleId);
  
  let totalAmount = 0;

  if (products) {
    // Calculate the total amount

    for (const product of products) {
      const { sellingPrice, quantity } = product;
      totalAmount += sellingPrice * quantity;
    }
  }
  
  const saleData = {
    customer,
    products,
    discount,
    payment,
    saleDate,
    status: payment === sale.totalAmount || totalAmount ? "completed" : payment < sale.totalAmount || totalAmount ? "partly-paid" : status,
  };

  if (products) {
    // Deduct the discount amount from the total amount
    const discountedAmount = totalAmount - discount;
    saleData.totalAmount = discountedAmount;
  }

  let balance = saleData.totalAmount - saleData.payment;

  if (saleData.status === "completed"){
    await updateStockOnSaleCompletion(saleId, balance);
  }

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

  updatedSale.status = updatedSale.payment === updatedSale.totalAmount ? "completed" : "partly-paid";

  // Save the updated sale
  await updatedSale.save();

  res.json(updatedSale);
});

// Controller for removing a sale item from a sale
exports.removeSaleItem = asyncHandler(async (req, res) => {
  const { saleId, saleItemId } = req.params;

  const updatedSale = await removeSaleItem(saleId, saleItemId);

  updatedSale.status = updatedSale.payment === updatedSale.totalAmount ? "completed" : "partly-paid";

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

// Controller for updating the stock when a sale is completed
exports.updateStockOnSaleCompletion = asyncHandler(async (req, res) => {
  const { saleId } = req.params;

  let sale = await getSaleById(saleId);

  let balance = sale.totalAmount - sale.payment;

  const stockUpdates = await updateStockOnSaleCompletion(saleId, balance);

  res.json(stockUpdates);
});

exports.updateSaleStatus = asyncHandler(async (req, res) => {
  const { saleId } = req.params;
  const { status } = req.body;

  const updatedSale = await updateSaleStatus(saleId, status);
  if (!updatedSale) {
    throw new ApiError(400, "Sale not found");
  }

  res.json(updatedSale);
});

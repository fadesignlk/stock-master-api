const asyncHandler = require("express-async-handler");
const {
  getCustomerById,
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../services/customerServices");
const ApiError = require("../utils/ApiError");
const Customer = require("../models/customerModel");

// Controller for getting a customer by ID
exports.getCustomerById = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const customer = await getCustomerById(customerId);
  if (!customer) throw new ApiError(400, "Customer not found");

  res.json(customer);
});

// Controller for getting all customers
exports.getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await getAllCustomers();
  res.json(customers);
});

// Controller for creating a new customer
exports.createCustomer = asyncHandler(async (req, res) => {
  const { name, contactNo, email, address } = req.body;

  if (!name || !contactNo) {
    throw new ApiError(400, "Please provide a name and contact number for the customer");
  }

  const customerData = {
    name,
    contactNo,
    email,
    address,
  };

  const newCustomer = await createCustomer(customerData);
  res.json(newCustomer);
});

// Controller for updating a customer
exports.updateCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const customerData = req.body;

  const updatedCustomer = await updateCustomer(customerId, customerData);
  if (!updatedCustomer) throw new ApiError(400, "Customer not found");

  res.json(updatedCustomer);
});

// Controller for deleting a customer
exports.deleteCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const deletedCustomer = await deleteCustomer(customerId);
  if (!deletedCustomer) throw new ApiError(400, "Customer not found");

  res.json(deletedCustomer);
});
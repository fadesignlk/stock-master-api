const Customer = require("../models/customerModel");

/**
 * Get a customer by ID.
 * @param {string} customerId - The ID of the customer to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved customer.
 */
exports.getCustomerById = (customerId) => Customer.findById(customerId);

/**
 * Get all customers.
 * @returns {Promise} - A promise that resolves to an array of all customers.
 */
exports.getAllCustomers = () => Customer.find();

/**
 * Create a new customer.
 * @param {Object} customerData - The data for the new customer.
 * @returns {Promise} - A promise that resolves to the newly created customer.
 */
exports.createCustomer = (customerData) => Customer.create(customerData);

/**
 * Update a customer.
 * @param {string} customerId - The ID of the customer to update.
 * @param {Object} customerData - The updated data for the customer.
 * @returns {Promise} - A promise that resolves to the updated customer.
 */
exports.updateCustomer = (customerId, customerData) =>
  Customer.findByIdAndUpdate(customerId, customerData, { new: true });

/**
 * Delete a customer.
 * @param {string} customerId - The ID of the customer to delete.
 * @returns {Promise} - A promise that resolves to the deleted customer.
 */
exports.deleteCustomer = (customerId) => Customer.findByIdAndDelete(customerId);

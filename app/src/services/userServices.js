const User = require("../models/userModel");
const { paginateResults } = require("./commonServices");

/**
 * Get a user by ID.
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved user.
 */
exports.getUserById = (userId) =>
  User.findById(userId)
    .select("-password -otp -otpExpires -resetExpires -resetToken -__v");

/**
 * Get all users.
 * @returns {Promise} - A promise that resolves to an array of all users.
 */
exports.getAllUsers = () =>
  User.find()
    .select("-password -otp -otpExpires -resetExpires -resetToken -__v");

/**
 * Create a new user.
 * @param {Object} userData - The data for the new user.
 * @returns {Promise} - A promise that resolves to the newly created user.
 */
exports.createUser = (userData) => User.create(userData);

/**
 * Get a user by email.
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved user.
 */
exports.getUserByEmail = (email) =>
  User
    .findOne({ email })
    .select("-password -otp -otpExpires -resetExpires -resetToken -__v");

/**
 * Update a user.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} userData - The updated data for the user.
 * @returns {Promise} - A promise that resolves to the updated user.
 */
exports.updateUser = (userId, userData) =>
  User
    .findByIdAndUpdate(userId, userData, { new: true })
    .select("-password -otp -otpExpires -resetExpires -resetToken -__v");

/**
 * Delete a user.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise} - A promise that resolves to the deleted user.
 */
exports.deleteUser = (userId) =>
  User
    .findByIdAndDelete(userId)
    .select("-password -otp -otpExpires -resetExpires -resetToken -__v");

/**
 * Get paginated users from the 'users' collection.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise} - A promise that resolves to an object containing paginated results.
 */
exports.getPaginatedUsers = (page, limit) =>
  paginateResults(User, page, limit);


/**
 * Get paginated products from the 'products' collection.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise} - A promise that resolves to an object containing paginated results.
 */
exports.getPaginatedProducts = (page, limit) =>
  paginateResults(Product, page, limit);

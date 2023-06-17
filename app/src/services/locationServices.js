const Location = require("../models/locationModel");

/**
 * Get a location by ID.
 * @param {string} locationId - The ID of the location to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved location.
 */
exports.getLocationById = (locationId) =>
  Location.findById(locationId);

/**
 * Get all locations.
 * @returns {Promise} - A promise that resolves to an array of all locations.
 */
exports.getAllLocations = () =>
  Location.find();

/**
 * Create a new location.
 * @param {Object} locationData - The data for the new location.
 * @returns {Promise} - A promise that resolves to the newly created location.
 */
exports.createLocation = (locationData) =>
  Location.create(locationData);

/**
 * Get a location by name.
 * @param {string} name - The name of the location to retrieve.
 * @returns {Promise} - A promise that resolves to the retrieved location.
 */
exports.getLocationByName = (name) =>
  Location.findOne({ name });

/**
 * Update a location.
 * @param {string} locationId - The ID of the location to update.
 * @param {Object} locationData - The updated data for the location.
 * @returns {Promise} - A promise that resolves to the updated location.
 */
exports.updateLocation = (locationId, locationData) =>
  Location.findByIdAndUpdate(locationId, locationData, { new: true });

/**
 * Delete a location.
 * @param {string} locationId - The ID of the location to delete.
 * @returns {Promise} - A promise that resolves to the deleted location.
 */
exports.deleteLocation = (locationId) =>
  Location.findByIdAndDelete(locationId);

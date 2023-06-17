const asyncHandler = require("express-async-handler");
const {
  getLocationById,
  getAllLocations,
  createLocation,
  getLocationByName,
  updateLocation,
  deleteLocation,
} = require("../services/locationServices");
const ApiError = require("../utils/ApiError");
const Location = require("../models/locationModel");

// Controller for getting a location by ID
exports.getLocationById = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const location = await getLocationById(locationId);
  if (!location) throw new ApiError(400, "Location not found");

  res.json(location);
});

// Controller for getting all locations
exports.getAllLocations = asyncHandler(async (req, res) => {
  const locations = await getAllLocations();
  res.json(locations);
});

// Controller for creating a new location
exports.createLocation = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Please provide a name for the location");
  }

  const locationExists = await Location.findOne({ name });

  if (locationExists) {
    throw new ApiError(400, "Location already exists");
  }

  const locationData = {
    name,
    description,
  };

  const newLocation = await createLocation(locationData);
  res.json(newLocation);
});

// Controller for getting a location by name
exports.getLocationByName = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const location = await getLocationByName(name);
  if (!location) throw new ApiError(400, "Location not found");

  res.json(location);
});

// Controller for updating a location
exports.updateLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const locationData = req.body;

  const updatedLocation = await updateLocation(locationId, locationData);
  if (!updatedLocation) throw new ApiError(400, "Location not found");

  res.json(updatedLocation);
});

// Controller for deleting a location
exports.deleteLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const deletedLocation = await deleteLocation(locationId);
  if (!deletedLocation) throw new ApiError(400, "Location not found");

  res.json(deletedLocation);
});

const express = require("express");
const router = express.Router();
const {
  createLocation,
  getLocationById,
  getAllLocations,
  getLocationByName,
  updateLocation,
  deleteLocation,
} = require("../controllers/locationControllers");
const { protect } = require("../middlewares/authMiddleware");
const { requireStaff } = require("../middlewares/authorizeMiddleware");

// POST /api/locations
router.post("/create-location", protect, requireStaff, createLocation);

// GET /api/locations/:locationId
router.get("/get-location/:locationId", protect, getLocationById);

// GET /api/locations/get-locations
router.get("/get-locations", protect, getAllLocations);

// GET /api/locations?name=:name
router.get("/", protect, getLocationByName);

// PUT /api/locations/:locationId
router.put("/update-location/:locationId", protect, requireStaff, updateLocation);

// DELETE /api/locations/:locationId
router.delete("/delete-location/:locationId", protect, requireStaff, deleteLocation);

module.exports = router;

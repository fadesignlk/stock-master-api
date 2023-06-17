const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserById,
  getAllUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
  getPaginatedUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/authorizeMiddleware");

// POST /api/users
router.post("/create-user", createUser);

// GET /api/users/:userId
router.get("/get-user/:userId", protect, getUserById);

// GET /api/users/get-users
router.get("/get-users", protect, getAllUsers);

// GET /api/users?email=:email
router.get("/", protect, getUserByEmail);

// PUT /api/users/:userId
router.put("/update-user/:userId", protect, updateUser);

// DELETE /api/users/:userId
router.delete("/delete-user/:userId", protect, requireAdmin, deleteUser);

// GET /api/users?page=:page&limit=:limit
router.get("/", protect, getPaginatedUsers);

module.exports = router;

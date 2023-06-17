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

// POST /api/users
router.post("/create-user", createUser);

// GET /api/users/:userId
router.get("/get-user/:userId", getUserById);

// GET /api/users/get-users
router.get("/get-users", getAllUsers);

// GET /api/users?email=:email
router.get("/", getUserByEmail);

// PUT /api/users/:userId
router.put("/update-user/:userId", updateUser);

// DELETE /api/users/:userId
router.delete("/delete-user/:userId", deleteUser);

// GET /api/users?page=:page&limit=:limit
router.get("/", getPaginatedUsers);

module.exports = router;

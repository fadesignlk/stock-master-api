const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  forgotPasword,
  resetPasword,
  logout,
  getMe
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

// POST /api/auth/login
router.post("/login", loginUser);

router.post("/logout", logout);

// POST /api/auth/register
// router.post("/register", registerUser);

// POST /api/auth/me
router.get("/me", protect, getMe);

// POST /api/auth/forgot-password
router.post("/forgot-password/:email", protect, forgotPasword);

// POST /api/auth/reset-password
router.post("/reset-password/:resetToken", protect, resetPasword);


module.exports = router;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String },
    status: { type: String, default: 'active', enum: ["inactive", "active"] },
    otp: { type: String },
    otpExpires: { type: Date },
    resetToken: { type: String },
    resetExpires: { type: Date },
  },
  { timestamps: true, collection: "users" }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
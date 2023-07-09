const jwt = require("jsonwebtoken");
const asyncHnadler = require("express-async-handler");

const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");

exports.protect = asyncHnadler(async (req, res, next) => {
  let token;

  //get token from cookies
  token = req.cookies.jwt;

  if (token) {
    try {
      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const user = await User.findById(decoded.id)
        .select("-password -createdAt -updatedAt -__v");

      if (!user) throw new ApiError(401, "User not found");
      req.user = user;

      next();
    } catch (error) {
      console.log(error);
      throw new ApiError(401, "Not authorized, invalid token");
    }
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token");
  }
});
const jwt = require("jsonwebtoken");
const asyncHnadler = require("express-async-handler");

const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");

exports.protect = asyncHnadler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get token from header
      token = req.headers.authorization.split(" ")[1];

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
      throw new ApiError(401, "You are not authorized");
    }
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token");
  }
});
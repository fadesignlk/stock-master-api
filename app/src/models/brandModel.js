const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    description: { type: String, },
  },
  { timestamps: true, collection: "brands" }
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
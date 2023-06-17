const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    address: { type: String, },
    contact: { type: String, },
    email: { type: String, },
  },
  { timestamps: true, collection: "suppliers" }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
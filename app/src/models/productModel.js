const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    brand: { type: mongoose.Types.ObjectId, ref: "Brand", required: true, },
    description: { type: String, },
    purchPrice: { type: Number, },
    sellingPrice: { type: Number, },
    sku: { type: String, },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    image: 
      {
        _id: { type: String, },
        url: { type: String, },
      },
  },
  { timestamps: true, collection: "products" }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
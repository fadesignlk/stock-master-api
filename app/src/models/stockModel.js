const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Types.ObjectId, ref: "Product", required: true, },
        supplier: { type: mongoose.Types.ObjectId, ref: "Supplier", required: true, },
        quantity: { type: Number, required: true, },
        location: { type: mongoose.Types.ObjectId, ref: "Location" },
        description: { type: String },
    },
    { timestamps: true, collection: "stocks" }
);

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
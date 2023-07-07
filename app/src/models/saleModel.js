const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
    product: { type: mongoose.Types.ObjectId, ref: "Product", required: true, },
    quantity: { type: Number, required: true },
    sellingPrice: { type: Number },
  });

const saleSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Types.ObjectId, ref: "Customer", required: true, },
        products: [{ type: saleItemSchema, required: true, }],
        totalAmount: { type: Number },
        discount: { type: Number },
        payment: { type: Number, default: 0 },
        saleDate: { type: Date },
        status: { type: String, default: 'pending', enum: ['pending', 'completed', 'delivered' ,'partially-paid', 'cancelled','refunded', 'exchanged']  },
    },
    { timestamps: true, collection: "sales" }
);

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
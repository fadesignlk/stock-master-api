const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
    stock: { type: mongoose.Types.ObjectId, ref: "Stock", required: true, },
    quantity: { type: Number, required: true },
  });

const saleSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Types.ObjectId, ref: "Customer", required: true, },
        items: [{ type: saleItemSchema, required: true, }],
        totalAmount: { type: Number },
        discount: { type: Number },
        payment: { type: Number, default: 0 },
        saleDate: { type: Date },
        status: { type: String, default: 'pending', enum: ['pending', 'completed', 'delivered' ,'partly-paid', 'cancelled','refunded', 'exchanged']  },
    },
    { timestamps: true, collection: "sales" }
);

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
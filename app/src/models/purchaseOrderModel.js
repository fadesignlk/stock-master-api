const mongoose = require("mongoose");

const purchaseOrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Types.ObjectId, ref: "Product", required: true, },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number },
  });

const purchaseOrderSchema = new mongoose.Schema(
    {
        supplier: { type: mongoose.Types.ObjectId, ref: "Supplier", required: true, },
        products: [{ type: purchaseOrderItemSchema, required: true, }],
        status: { type: String, default: 'draft', enum: ['draft', 'approved', 'cancelled', 'ordered', 'paid', 'completed'] },
        expectedDeliveryDate: { type: Date },
        receivedDate: { type: Date },
    },
    { timestamps: true, collection: "purchaseOrders" }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

module.exports = PurchaseOrder;
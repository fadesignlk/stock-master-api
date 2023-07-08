const mongoose = require("mongoose");

const purchaseOrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Types.ObjectId, ref: "Product", required: true, },
    quantity: { type: Number, required: true },
    purchasingPrice: { type: Number, required: true },
  });

const purchaseOrderSchema = new mongoose.Schema(
    {
        supplier: { type: mongoose.Types.ObjectId, ref: "Supplier", required: true, },
        products: [{ type: purchaseOrderItemSchema, required: true, }],
        totalAmount: { type: Number },
        paidAmount: { type: Number },
        status: { type: String, default: 'draft', enum: ['draft', 'approved', 'cancelled', 'ordered', 'paid', 'patly-paid', 'received'] },
        expectedDeliveryDate: { type: Date },
        receivedDate: { type: Date },
    },
    { timestamps: true, collection: "purchaseOrders" }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

module.exports = PurchaseOrder;
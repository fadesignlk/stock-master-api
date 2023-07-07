const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        contactNo: { type: String, required: true },
        email: { type: String, },
        address: { type: String, },
    },
    { timestamps: true, collection: "customers" }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Additem", required: true },
    quantity: { type: Number, default: 1, required: true },
});

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: [OrderItemSchema],
    amount: { type: Number, default: 0 },
    address: { type: Object, required: true },
    status: { type: String, default: "processing", required: true },
    paymentStatus: { type: Boolean, default: false, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", OrderSchema);
    
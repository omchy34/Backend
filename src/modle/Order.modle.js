import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    productId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Additem" }],
    amount: { type: Number, default: 0 },
    address: { type: Object, required: true },
    status: { type: String, default: "processing", required: true },
    paymentStatus: { type: Boolean, default: false, required: true },
    createdAt: { type: Date, default: Date.now() },
}) ;
export const Order = mongoose.model("Order", OrderSchema);
import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    productId: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    Price: { type: Number, default: 0 },
    address: { type: String, required: true },
    status: { type: String, default: "processing", required: true },
    paymentStatus: { type: Boolean, default: false, required: true },
    createdAt: { type: Date, default: Date.now() },
}) ;
export const Order = mongoose.model("Order", OrderSchema);
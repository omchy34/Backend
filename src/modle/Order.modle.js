import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Additem", required: true },
  ProductName: { type: String, required: true },
  ProductImg: { type: String, required: true },
  quantity: { type: Number, default: 1, required: true },
  createdAt: { type: Date, default: Date.now },
  address: { type: Object, required: true }
});

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  items: [OrderItemSchema],
  amount: { type: Number, default: 0 },
  paymentStatus: { type: String },
});

export const Order = mongoose.model("Order", OrderSchema);

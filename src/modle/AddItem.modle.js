import mongoose from "mongoose";

const AddItemSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  }
});

export const Additem = mongoose.model("Additem", AddItemSchema);

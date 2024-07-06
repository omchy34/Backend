import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const AddItemSchema = new Schema({
    ProductName: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        require:true,
    },
    Price:{
        type: Number,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    }
});

export const Additem = mongoose.model("food" , AddItemSchema);


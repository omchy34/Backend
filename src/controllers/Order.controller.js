import Razorpay from "razorpay";
import { Order } from '../modle/Order.modle.js'; // corrected import path
import { User } from '../modle/user.modle.js'; // corrected import path
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const placeOrder = asyncHandler(async (req, res) => {
    try {
        const { productId , Price, address } = req.body;
        const userId = req.user._id;
        // Create new order
        const newOrder = new Order({
            user: userId,
            productId,
            Price,
            address,
        });

        await newOrder.save();
        await User.findByIdAndUpdate(userId, { cartData: {} });

        // Create Razorpay order
        const options = {
            amount: amount * 100, // amount in paise
            currency: "INR",
            receipt: newOrder._id.toString(),
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.status(200).json(new ApiResponse(200, {
            orderId: newOrder._id,
            razorpayOrderId: razorpayOrder.id,
            Price: razorpayOrder.Price,
            currency: razorpayOrder.currency
        }, "Order placed successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const verify = asyncHandler((req, res) => {

})

export { placeOrder , verify};

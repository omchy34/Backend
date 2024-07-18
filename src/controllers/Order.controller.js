import Razorpay from "razorpay";
import { Order } from '../modle/Order.modle.js';
import { User } from '../modle/user.modle.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const placeOrder = asyncHandler(async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_KEY,
        });
        const { productId, amount, address } = req.body;
        const userId = req.user._id;

        if (!productId || !amount || !address) {
            throw new ApiError(400, "Missing required fields");
        }

        const newOrder = new Order({
            user: userId,
            productId,
            amount,
            address,
        });

        await newOrder.save();
        await User.findByIdAndUpdate(userId, { cartData: [] });

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: newOrder._id ? newOrder._id.toString() : undefined, // Ensure newOrder._id is defined
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.status(200).json(new ApiResponse(200, {
            orderId: newOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount / 100,
            address,
            currency: razorpayOrder.currency,
            ClearCart: true // Add this line to indicate the cart should be cleared
        }, "Order placed successfully"));
    } catch (error) {
        console.error("Order placement error:", error);
        throw new ApiError(500, error.message);
    }
});


const verify = asyncHandler((req,res) => {
    //
})

export { placeOrder , verify };

import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../modle/Order.modle.js";
import { User } from "../modle/user.modle.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const placeOrder = asyncHandler(async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const { items, address, amount } = req.body;
    const userId = req.user._id;

    if (!items || !address) {
      throw new ApiError(400, "Missing required fields");
    }

    const newOrder = new Order({
      user: userId,
      items,
      amount,
      address,
    });

    await newOrder.save();
    await User.findByIdAndUpdate(userId, { cartData: [] });

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          orderId: newOrder._id,
          razorpayOrderId: razorpayOrder.id,
          items,
          amount: razorpayOrder.amount / 100,
          address,
          currency: razorpayOrder.currency,
          paymentStatus: "created",
          clearCart: true,
        },
        "Order placed successfully"
      )
    );
  } catch (error) {
    console.error("Order placement error:", error);
    throw new ApiError(500, error.message);
  }
});

const verify = asyncHandler(async (req, res) => {
  try {
    const { Payment_Id, Order_Id , Signature, amount, items, address } = req.body;

    // // Verify the signature
    // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
    // hmac.update(`${Payment_Id}`);
    // const generatedSignature = hmac.digest('hex');

    // if (generatedSignature !== Signature) {
    //   throw new ApiError(400, "Invalid payment signature");
    // }

    const orderConfirm = await Order.create({
      user: req.user._id ,
      Payment_Id,
      Order_Id,
      Signature,
      amount,
      items ,
      address,
      paymentStatus: "paid"
    });

    res.json(new ApiResponse(200, { orderConfirm }, "Payment successful"));
  } catch (error) {
    console.error("Payment verification error:", error);
    throw new ApiError(500, error.message);
  }
});

const SuccessOrder = asyncHandler(async(req,res) => {
  try {
    const user = req.user._id;
    console.log("user :" , user);
    const order = await Order.find({user})
    res.json(new ApiResponse(200, {order}, "Order Success"));
  } catch (error) {
    res.json(new ApiError(401 , {} , "Error on server side "))
  }
})

const GetAllOrders = asyncHandler(async (req , res) => {
  try {
    // const user = req.user ;
    // console.log("allUser :" , user);
    const order = await Order.find() ;
    // console.log(order);
    res.json(new ApiResponse(200, {order}, "Order Success"));
  } catch (error) {
    res.json(new ApiError(401 , {} , "Error on server side "))
  }
})

export { placeOrder, verify , SuccessOrder , GetAllOrders};

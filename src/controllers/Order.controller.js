import Razorpay from "razorpay";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../modle/user.modle.js";
import { Additem } from "../modle/AddItem.modle.js";
import { Order } from "../modle/Order.modle.js";
import crypto from "crypto";

const placeOrder = asyncHandler(async (req, res) => {
  try {
    const { items, amount } = req.body;
    const userId = req.user._id;

    if (!items || items.length === 0) {
      throw new ApiError(400, "Order items are required");
    }

    if (!amount) {
      throw new ApiError(400, "Amount is required");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Additem.findById(item.productId);
        if (!product) {
          throw new ApiError(404, `Product not found: ${item.productId}`);
        }

        return {
          productId: product._id,
          quantity: item.quantity,
          address: item.address, // Correctly reference the address here
          ProductName: product.ProductName,
          ProductImg: product.images,
        };
      })
    );

    const newOrder = new Order({
      items: orderItems,
      user: userId,
      amount,
      paymentStatus: "pending",
    });
    await newOrder.save();

    // Generate Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json(
      new ApiResponse(
        200,
        {
          orderId: newOrder._id,
          razorpayOrderId: razorpayOrder.id,
          amount,
          newOrder,
        },
        "Order placed successfully"
      )
    );
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json(new ApiError(500, `Error: ${error.message}`));
  }
});

const verify = asyncHandler(async (req, res) => {
  try {
    const { Payment_Id, Order_Id, Signature, newOrder } = req.body;

   

    // Find the existing order and update its status
    const order = await Order.findById(newOrder._id);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    order.paymentStatus = "Paid";
    await order.save();

    res.json(new ApiResponse(200, { order }, "Payment successful"));
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json(new ApiError(500, `Error: ${error.message}`));
  }
});


const SuccessOrder = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
    const order = await Order.find({ user });
    res.json(new ApiResponse(200, { order }, "Order Success"));
  } catch (error) {
    res.json(new ApiError(401, {}, "Error on server side"));
  }
});

const GetAllOrders = asyncHandler(async (req, res) => {
  try {
    
    const order = await Order.find()
    console.log("ok");

    const allData = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails"
        }
      } , 
      {
        $addFields: {
          userDetails: {
            $arrayElemAt : ["$userDetails" , 0]
          }
        }
      }
    ])
   
    res.json(new ApiResponse(200, { allData }, "Order Success"));
  } catch (error) {
    res.json(new ApiError(401, {error}, "Error on server side"));
  }
});

const DeleteOrder = asyncHandler(async(req , res)=>{
  const { requestId } = req.params; 
  const OrderReq = await Order.findByIdAndDelete(requestId) ;
  if(!OrderReq){
    throw new ApiError(404 , "Order request not find")
  }

  res.json(new ApiResponse(200 , "Order item deleted..."))
})

export { placeOrder, verify, SuccessOrder, GetAllOrders , DeleteOrder};

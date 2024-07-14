import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../modle/user.modle.js";

const AddToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // Assuming req.user is set by your auth middleware

    if (!productId || !quantity) {
      throw new ApiError(400, {}, "Product ID and quantity are required");
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      throw new ApiError(400, {}, "Quantity must be a positive number");
    }

    // // Log the input values
    // console.log("Product ID:", productId);
    // console.log("Quantity:", quantity);
    // console.log("User ID:", userId);

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, {}, "User not found");
    }

    // Log user cartData before adding item
    // console.log("User cartData before:", user.cartData);

    // if (!Array.isArray(user.cartData)) {
    //   console.error("cartData is not an array:", user.cartData);
    //   throw new ApiError(500, {}, "Internal server error: cartData is not an array");
    // }

    const existingItemIndex = user.cartData.findIndex(item => {
      // console.log("item:", item);
      // console.log("Item productId:", item.productId);
      // console.log("Comparing with productId:", productId);
      return item.productId.toString() === productId.toString();
    });

    if (existingItemIndex > -1) {
      user.cartData[existingItemIndex].quantity = quantity;
    } else {
      user.cartData.push({ productId, quantity });
    }

    await user.save();

    // Log user cartData after adding item
    console.log("User cartData after:", user.cartData);

    res.json(new ApiResponse(200, {}, "Item Added To Cart"));
  } catch (error) {
    // Log the error
    console.error("Error adding to cart:", error);
    res.status(500).json(new ApiError(500, {}, `Error: ${error.message}`));
  }
});

// Remove From Cart

const RemoveFromCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id; // Assuming req.user is set by your auth middleware

    if (!productId) {
      throw new ApiError(400, {}, "Product ID is required");
    }

    // // Log the input values
    // console.log("Product ID:", productId);
    // console.log("User ID:", userId);

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, {}, "User not found");
    }

    // Log user cartData before removing item
    // console.log("User cartData before:", user.cartData);

    // if (!Array.isArray(user.cartData)) {
    //   console.error("cartData is not an array:", user.cartData);
    //   throw new ApiError(500, {}, "Internal server error: cartData is not an array");
    // }

    const itemIndex = user.cartData.findIndex(item => {
      console.log("item:", item);
      console.log("Item productId:", item.productId);
      console.log("Comparing with productId:", productId);
      return item.productId.toString() === productId.toString();
    });

    if (itemIndex > -1) {
      user.cartData.splice(itemIndex, 1); // Remove the item from the cart
    } else {
      throw new ApiError(404, {}, "Product not found in cart");
    }

    await user.save();

    // Log user cartData after removing item
    console.log("User cartData after:", user.cartData);

    res.json(new ApiResponse(200, {}, "Item Removed From Cart"));
  } catch (error) {
    // Log the error
    console.error("Error removing from cart:", error);
    res.status(500).json(new ApiError(500, {}, `Error: ${error.message}`));
  }
});


// Fetch user cart data
const GetCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user is set by your auth middleware

    const user = await User.findById(userId).populate('cartData.productId');

    if (!user) {
      throw new ApiError(404, {}, "User not found");
    }

    res.json(new ApiResponse(200, user.cartData, "Cart Data Fetched Successfully"));
  } catch (error) {
    res.json(new ApiError(500, {}, `Error: ${error.message}`));
  }
});

export { AddToCart, RemoveFromCart ,GetCart };

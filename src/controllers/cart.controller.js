import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../modle/user.modle.js";
import { Additem } from "../modle/AddItem.modle.js";

const AddToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !quantity) {
      throw new ApiError(400, "Product ID and quantity are required");
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      throw new ApiError(400, "Quantity must be a positive number");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const product = await Additem.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const itemIndex = user.cartData.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      user.cartData[itemIndex].quantity = quantity;
    } else {
      user.cartData.push({ productId, quantity, ProductImg: product.images, ProductName: product.ProductName });
    }

    await user.save();
    res.json(new ApiResponse(200, user.cartData, "Item added to cart"));
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json(new ApiError(500, `Error: ${error.message}`));
  }
});

const RemoveFromCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const itemIndex = user.cartData.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    if (itemIndex > -1) {
      user.cartData.splice(itemIndex, 1);
    } else {
      throw new ApiError(404, "Product not found in cart");
    }

    await user.save();
    res.json(new ApiResponse(200, user.cartData, "Item Removed From Cart"));
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json(new ApiError(500, `Error: ${error.message}`));
  }
});

const GetCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("cartData.productId");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json(new ApiResponse(200, user.cartData, "Cart Data Fetched Successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, `Error: ${error.message}`));
  }
});

export { AddToCart, RemoveFromCart, GetCart };

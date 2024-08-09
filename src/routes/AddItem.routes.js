import { Router } from "express";
import {
  addItem,
  ListProduct,
  DeleteProduct,
  ProductDetails ,
} from "../controllers/AddItem.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js"; // Ensure the correct path
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // Import asyncHandler
import multer from "multer";
import { verifyAdminJWT } from "../middlewere/Auth.middlewere.js"; // Import verifyAdminJWT

const AddItemRouter = Router();

// Route to add an item with verification middleware
AddItemRouter.route("/AddItem").post(
  verifyAdminJWT, // Apply middleware only to this route
  upload.fields([{ name: "images", maxCount: 1 }]),
  (req, res, next) => {
    if (req.fileValidationError) {
      return next(new ApiError(400, req.fileValidationError)); // Handle file validation errors
    }
    next(); // Proceed to the next middleware or route handler
  },
  asyncHandler(addItem) // Wrap addItem with asyncHandler
);

AddItemRouter.route("/ProductList").post(ListProduct); // Wrap ListProduct with asyncHandler


AddItemRouter.route("/ProductDetails/:id").post(verifyAdminJWT , ProductDetails)
// Route to delete a product with verification middleware
AddItemRouter.route("/DeleteProduct").post(
  verifyAdminJWT, // Apply middleware only to this route
  asyncHandler(async (req, res, next) => {
    try {
      await DeleteProduct(req, res); // Await the asynchronous operation
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error); // Pass ApiError to Express error handler
      }
      next(new ApiError(500, "Internal Server Error")); // Handle other errors generically
    }
  })
);

export default AddItemRouter;

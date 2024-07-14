import { Router } from "express";
import {
  addItem,
  ListProduct,
  DeleteProduct,
} from "../controllers/AddItem.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js"; // Ensure the correct path
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // Import asyncHandler
import multer from "multer";


const AddItemRouter = Router();

AddItemRouter.route("/AddItem").post((req, res, next) => {
  upload.fields([{ name: "images", maxCount: 1 }])(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      next(new ApiError(400, err.message));
    } else if (err) {
      next(err);
    } else {
      next();
    }
  });
}, asyncHandler(addItem)); // Use asyncHandler to wrap addItem

AddItemRouter.route("/ProductList").post(asyncHandler(ListProduct)); // Use asyncHandler to wrap ListProduct

AddItemRouter.route("/DeleteProduct").post(asyncHandler(async (req, res, next) => {
  try {
    await DeleteProduct(req, res); // Ensure to await the asynchronous operation
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error); // Pass ApiError to Express error handler
    }
    next(new ApiError(500, "Internal Server Error")); // Handle other errors generically
  }
}));

export default AddItemRouter;

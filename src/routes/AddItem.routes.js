import { Router } from "express";
import { addItem } from "../controllers/AddItem.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js";  // Ensure the correct path
import { ApiError } from "../utils/ApiError.js";
import multer from "multer";

const AddItemRouter = Router();

AddItemRouter.route("/AddItem").post((req, res, next) => {
  upload.fields([{ name: "image", maxCount: 1 }])(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      next(new ApiError(400, err.message));
    } else if (err) {
      next(err);
    } else {
      next();
    }
  });
}, addItem);

export default AddItemRouter;

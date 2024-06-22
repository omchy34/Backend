import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// File filter function to allow only images
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Invalid file type. Only image files are allowed."), false);
  }
};

// Create the multer instance with the storage and file filter
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

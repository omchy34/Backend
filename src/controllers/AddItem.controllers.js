import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Additem} from "../modle/AddItem.modle.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const addItem = asyncHandler(async (req , res) => {
    const {name , price , description , image} = req.body;

    if ([fullName, userName, phone, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
      }
    
      const existUser = await User.findOne({
        $or: [{ userName }, { email }],
      });
    
      if (existUser) {
        throw new ApiError(409, "User with email or username already exists");
      }
    
      const avatarLocalPath = req.files?.avatar[0]?.path;
    
      if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
      }
    
      const avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
      }
    
      const user = await User.create({
        fullName,
        userName,
        email,
        phone,
        password,
        avatar: avatar.url
      });
    

})

export default addItem ;
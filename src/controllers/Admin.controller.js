import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../modle/user.modle.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



const generateAccessAndRefreshtoken = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = await user.generateAccessToken();
      // console.log(accessToken);
      const refreshToken = await user.generateRefreshToken();
      // console.log(refreshToken);
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        `something  went wrong while creating user ${error}`
      );
    }
  };
  

export const AdminLogin = asyncHandler(async (req, res) => {
  
    const { identifier, password } = req.body;
  
    console.log(req.body);
  
    if (!identifier) {
      throw new ApiError(400, "userName and email is required");
    }
  
    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });
  
  
    if (!user) {
      throw new ApiError(404, "user dose not exist");
    }
  
    if(user.isAdmin === true){

        const isPasswordValid = await user.isPasswordCorrect(password);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
          throw new ApiError(401, "invalid user crendatials");
        }
        const { accessToken } = await generateAccessAndRefreshtoken(
          user._id
        );
      
        const loggedInUAdmin = await User.findById(user._id).select(
          "-password -refreshToken"
        );
    
        return res.json(new ApiResponse(200 , {accessToken , loggedInUAdmin} , "Admin Login success"))
    }

 
  });

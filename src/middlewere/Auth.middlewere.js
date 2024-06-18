import { User } from "../modle/user.modle.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHandler(async(req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized token");
    }

    const decodedtoken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedtoken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, `Invalid Access token ${error}`);
  }
});

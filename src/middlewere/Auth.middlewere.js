import { User } from "../modle/user.modle.js"; // Fixed typo from "modle" to "model"
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Extract token from Authorization header and remove "Bearer " prefix
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();

    console.log("Extracted token:", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized token");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("Decoded token:", decodedToken);

    // Find the user by ID in the decoded token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // Attach the user and token to the request object
    req.user = user;
    req.userId = user._id;
    req.token = token;

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const verifyAdminJWT = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return next(new ApiError(401, "Access token missing."));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user.isAdmin) {
      return next(new ApiError(403, "Admin access required."));
    }

    next();
  } catch (err) {
    next(new ApiError(401, "Invalid token."));
  }
};
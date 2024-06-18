import { User } from "../modle/user.modle";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const tocken =
      req.cookies?.accessTocken ||
      req.header("Authorization")?.replace("bearer", "");
  
    if (!tocken) {
      throw new ApiError(401, "Unauthorized tocken");
    }
    const decodedTocken = jwt.verify(tocken, process.env.ACCESS_TOKEN_SECRET);
  
    const user = await User.findById(decodedTocken?._id).select(
      "-password -refreshTocken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid access Tocken");
    }
  
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401 , "Invalid Access Tocken")
  }
});

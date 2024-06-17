import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../modle/user.modle.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user data from frontend
  // validation
  // check user alredy exist or not : username email
  // check for avatar
  // upload on cloudinary
  // success or not in cloudinary
  // create user obj - create entery in db
  // reemove pass and refresh tocken filed from response
  // check user creation
  // return res

  const { fullName, userName, email, password } = req.body;
  if (
    [fullName, userName, email, password].some((filed) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "all filed are required");
  }

  const existUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existUser) {
    throw new ApiError(409, "user with email and username is already exist");
  }

  const avatarLocalFile = req.files?.avatar[0].path;
  if (!avatarLocalFile) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalFile);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    avatar: avatar.url,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshTocken"
  );
  if (!createdUser) {
    throw new ApiError(
      500,
      "something went wrong while user registering the user"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered successfully"));
});

export { registerUser };

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

const registerUser = asyncHandler(async (req, res) => {
  // get user data from frontend
  // validation
  // check user alredy exist or not : username email
  // check for avatar
  // upload on cloudinary
  // success or not in cloudinary
  // create user obj - create entery in db
  // reemove pass and refresh token filed from response
  // check user creation
  // return res

  const { fullName, userName, email, password } = req.body;
  //   console.log(req.body);
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
  //   console.log(req.files);
  if (!avatarLocalFile) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalFile);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    userName: userName,
    avatar: avatar.url,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
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

const LoginUser = asyncHandler(async (req, res) => {
  // req.body - data
  // username or eamil
  // find user
  // passwordcheck
  // acces and refresh token
  //  send cookie

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

  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user crendatials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshtoken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    // secure: true,
  };
  console.log(accessToken);
  console.log(refreshToken);


  return res
    .status(200)
    // .cookie("accessToken", accessToken , options)
    // .cookie("refreshToken", refreshToken , options)
    .json(
      new ApiResponse(
        200,
        {
          loggedInUser,
          accessToken,
         refreshToken,
        },
        "user LoggedIn successFully "
      ),
    );
});

// const LoggedOut = asyncHandler(async (req, res) => {
//   await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $unset: { refreshtoken: 1 },
//     },
//     {
//       new: true,
//     }
//   );

//   // const options = {
//   //   httpOnly: true,
//   //   secure: false,
//   // };

//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "User LoggedOut"));
// });

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incommingRefreshToken) {
    throw new ApiError(401, "unauthorize token ");
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "invalid refresh token ");
    }
    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is expair and used");
    }

    const options = {
      httpOnly: true,
      secure: false,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshtoken(user?._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "acces token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message || "invalid refresh token ")
  }
});

export { registerUser, LoginUser,  refreshAccessToken };

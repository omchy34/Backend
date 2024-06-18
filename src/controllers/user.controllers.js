import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../modle/user.modle.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTocken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessTocken = user.generateAccessTocken();
    const refreshTocken = user.generateRefreshToken();
    user.refreshTocken = refreshTocken;
    await user.save({ validateBeforeSave: false });

    return { accessTocken, refreshTocken };
  } catch (error) {
    throw new ApiError(500, "something  went wrong while creating user ");
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
  // reemove pass and refresh tocken filed from response
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

const LoginUser = asyncHandler(async (req, res) => {
  // req.body - data
  // username or eamil
  // find user
  // passwordcheck
  // acces and refresh tocken
  //  send cookie

  const { userName, email, password } = req.body;
  if (!(userName || email)) {
    throw new ApiError(400, "userName and email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "user dose not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user crendatials");
  }

  const { accessTocken, refreshTocken } = await generateAccessAndRefreshTocken(
    user._id
  );

  const LoggedInUser = User.findById(User._id).select(
    "-password , -refreshTocken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessTocken", accessTocken, options)
    .cookie("refreshTocken", refreshTocken, options)
    .json(
      new ApiResponse(
        200,
        {
          LoggedInUser: LoggedInUser,
          accessTocken,
          refreshTocken,
        },
        "user LoggedIn successFully "
      )
    );
});

const LoggedOut = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshTocken: undefined },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessTocken", options)
    .clearCookie("refreshTocken", options)
    .json(200 , {} , "user Logged Out");
});

export { registerUser, LoginUser, LoggedOut };

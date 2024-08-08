import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../modle/user.modle.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshtoken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        await user.save({ validateBeforeSave: false });

        return { accessToken };
    } catch (error) {
        throw new ApiError(
            500,
            `something  went wrong while creating user ${error}`
        );
    }
};

// controllers/user.controller.js
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, phone } = req.body;

    if (
        [fullName, phone, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existUser = await User.findOne({
        $or: [{ phone }, { email }],
    });

    if (existUser) {
        throw new ApiError(409, "User with email or phone already exists");
    }

    const user = await User.create({
        fullName,
        email,
        phone,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User Registered successfully"));
});

// fetch all users
const fetchUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");
    if (!users) {
        throw new ApiError(500, "Something went wrong while fetching users");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully"));
});

//delete user Form DB
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.json(new ApiResponse(200, user, "User deleted successfully"));
});

const LoginUser = asyncHandler(async (req, res) => {
    // req.body - data
    // username or eamil
    // find user
    // passwordcheck
    // acces and refresh token
    //  send cookie

    const { email, password } = req.body;

    console.log(req.body);

    if (!email) {
        throw new ApiError(400, " email is required");
    }

    const user = await User.findOne({
        $or: [{ email: email }],
    });

    if ((user.isAdmin === false)) {
        if (!user) {
            throw new ApiError(404, "user dose not exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
            throw new ApiError(401, "invalid user crendatials");
        }
        const { accessToken } = await generateAccessAndRefreshtoken(user._id);

        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );
        return (
            res.json(
                new ApiResponse(
                    200,
                    {
                        loggedInUser,
                        accessToken,
                    },
                    "user LoggedIn successFully "
                )
            )
        );
    } else {
        throw new ApiError(400, {}, "Please Dont  try to access")
    }

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

const userData = asyncHandler(async (req, res) => {
    try {
        return res.json(
            new ApiResponse(200, {
                user: req.user,
                token: req.token,
            })
        );
    } catch (error) { }
});

export { registerUser, fetchUsers, deleteUser, LoginUser, userData };

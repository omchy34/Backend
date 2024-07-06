import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Additem } from "../modle/AddItem.modle.js";  // Ensure correct path

const addItem = asyncHandler(async (req, res) => {
    const { ProductName, Price, Description , category } = req.body;

    if ([ProductName, Description, Price , category].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existItem = await Additem.findOne({
        $or: [{ ProductName }, { Description }],
    });

    if (existItem) {
        throw new ApiError(409, "Product already exists");
    }

    const imageLocalPath = req.files?.image?.[0]?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Image file is required");
    }

    const uploadImage = await uploadOnCloudinary(imageLocalPath);
    if (!uploadImage) {
        throw new ApiError(400, "Image upload failed");
    }

    const newItem = await Additem.create({
        ProductName,
        Price,
        Description,
        image: uploadImage.url,  // Assuming uploadOnCloudinary returns an object with url property
        category
    });

    const addedItem = await Additem.findById(newItem._id);
    if (!addedItem) {
        throw new ApiError(500, "Something went wrong while adding the item");
    }

    return res.status(201).json(new ApiResponse(201, addedItem, "Item added successfully"));
});

export { addItem };

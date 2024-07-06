import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary , deleteFromCloudinary} from "../utils/cloudinary.js";
import { Additem } from "../modle/AddItem.modle.js";  // Ensure correct path

const addItem = asyncHandler(async (req, res) => {
    const { ProductName, Price, Description , category } = req.body;

    if ([ProductName, Description, Price , category].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
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

const ListProduct = asyncHandler(async (req,res) => {
    try {
        const products = await Additem.find({});
        return res.status(200).json(new ApiResponse(200, products, "Products listed successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while listing the products");
    }
})

const DeleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.body; // Assuming you pass id in req.body

    if (!id) {
        throw new ApiError(400, "Product ID is required");
    }

    const product = await Additem.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Delete image from Cloudinary
    const deleteImageResult = await deleteFromCloudinary(product.image);

    if (!deleteImageResult) {
        throw new ApiError(500, "Failed to delete image from Cloudinary");
    }

    // Delete product from database
    await Additem.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, product, "Product deleted successfully"));
});

export { addItem , ListProduct , DeleteProduct};

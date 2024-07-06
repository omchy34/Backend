import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        fs.unlinkSync(localFilePath); // Remove local file after successful upload

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove local file if upload operation fails
        return null;
    }
};

const deleteFromCloudinary = async (imageUrl) => {
    try {
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public ID from URL

        await cloudinary.uploader.destroy(publicId);

        return true;
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        return false;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };

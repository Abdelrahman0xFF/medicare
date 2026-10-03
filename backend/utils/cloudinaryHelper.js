import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger.js";

export const extractPublicId = (url) => {
    if (!url || typeof url !== "string") return null;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    return match ? match[1] : null;
};

export const deleteCloudinaryAsset = async (publicIdOrUrl) => {
    if (!publicIdOrUrl) return false;

    let publicId = publicIdOrUrl;
    if (publicIdOrUrl.startsWith("http://") || publicIdOrUrl.startsWith("https://")) {
        publicId = extractPublicId(publicIdOrUrl);
    }

    if (!publicId) return false;

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        logger.info(`Cloudinary asset destroyed: ${publicId} (result: ${result.result})`);
        return result.result === "ok";
    } catch (err) {
        logger.error(`Failed to destroy Cloudinary asset (${publicId}): ${err.message}`);
        return false;
    }
};
